import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import { apiFetch } from '../services/api'
import { setToken, getToken, clearSession } from '../services/auth'

const AuthContext = createContext(null)

const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) return import.meta.env.VITE_SOCKET_URL
  if (typeof window !== 'undefined') {
    const origin = window.location.origin
    if (origin.includes('loca.lt') || origin.includes('netlify.app') || !origin.includes('localhost')) {
      return origin
    }
  }
  return 'http://localhost:5000'
}

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => {
    try {
      const saved = sessionStorage.getItem('justus_session_user')
      return saved ? JSON.parse(saved) : null
    } catch (e) {
      return null
    }
  })

  const [spaceConnection, setSpaceConnection] = useState({
    connected: false,
    code: null,
    partnerName: null,
    partnerEmail: null,
    connectedAt: null,
  })

  const [socket, setSocket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Real data state
  const [specialDates, setSpecialDates] = useState([])
  const [specialMoments, setSpecialMoments] = useState([])
  const [memoryFolders, setMemoryFolders] = useState([])
  const [memories, setMemories] = useState([])
  const [chatMessages, setChatMessages] = useState([])
  const [notifications, setNotifications] = useState([])

  const [smsPreferences, setSmsPreferences] = useState({ enabled: true, phoneNumber: '' })
  const [songsSharedCount, setSongsSharedCount] = useState(0)
  const [videosWatchedCount, setVideosWatchedCount] = useState(0)

  // Live real-time single room states (authoritative from server)
  const [partnerStatus, setPartnerStatus] = useState({ isOnline: false })
  const [sharedMusicState, setSharedMusicState] = useState(null)
  const [sharedVideoState, setSharedVideoState] = useState(null)
  const [liveLoveReaction, setLiveLoveReaction] = useState(null)

  // Check auth session on load & refresh space status
  const checkSession = async () => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const res = await apiFetch('/auth/me')
      if (res.user) {
        setUserState(res.user)
        try { sessionStorage.setItem('justus_session_user', JSON.stringify(res.user)) } catch (e) {}
        if (res.spaceConnection) {
          setSpaceConnection(res.spaceConnection)
        }
      }
    } catch (err) {
      console.warn('Session check failed or expired token', err)
      clearSession()
      try { sessionStorage.removeItem('justus_session_user') } catch (e) {}
      setUserState(null)
      setSpaceConnection({ connected: false, code: null, partnerName: null, partnerEmail: null })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkSession()

    const handleUnauthorized = () => {
      clearSession()
      try { sessionStorage.removeItem('justus_session_user') } catch (e) {}
      setUserState(null)
      setSpaceConnection({ connected: false, code: null, partnerName: null, partnerEmail: null })
    }

    window.addEventListener('justus:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('justus:unauthorized', handleUnauthorized)
  }, [])

  // Cross-tab real-time sync & auto polling when waiting for partner connection
  useEffect(() => {
    if (!user) return

    const handleSync = () => {
      checkSession()
    }

    try {
      const channel = new BroadcastChannel('justus_space_connection')
      channel.onmessage = handleSync

      const handleStorageChange = (e) => {
        if (e.key === 'justus_space_sync_event') {
          handleSync()
        }
      }

      window.addEventListener('storage', handleStorageChange)
      window.addEventListener('focus', handleSync)

      let pollInterval = null
      if (!spaceConnection.connected) {
        pollInterval = setInterval(() => {
          checkSession()
        }, 3000)
      }

      return () => {
        channel.close()
        window.removeEventListener('storage', handleStorageChange)
        window.removeEventListener('focus', handleSync)
        if (pollInterval) clearInterval(pollInterval)
      }
    } catch (e) {}
  }, [user, spaceConnection.connected])

  // Socket.IO Connection & Clean Listener Setup
  useEffect(() => {
    const token = getToken()
    if (!user || !token) {
      if (socket) {
        socket.disconnect()
        setSocket(null)
      }
      return
    }

    const socketUrl = getSocketUrl()
    const newSocket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
    })

    const onConnect = () => {
      console.log('⚡ Socket.IO Connected to Server')
      if (user.connectionId) {
        newSocket.emit('join_space', { connectionId: user.connectionId })
      }
      newSocket.emit('get_room_state')
    }

    const onPartnerStatus = (data) => setPartnerStatus(data)
    const onChatMessage = (message) => {
      setChatMessages((prev) => {
        if (!message || !message._id) return prev
        // 1. If already exists by _id, do not duplicate
        if (prev.some((m) => m._id === message._id)) return prev
        // 2. If an optimistic temp message exists matching text & sender, replace temp message with actual server message
        const tempIndex = prev.findIndex(
          (m) => typeof m._id === 'string' && m._id.startsWith('temp_') && m.text === message.text
        )
        if (tempIndex !== -1) {
          const updated = [...prev]
          updated[tempIndex] = message
          return updated
        }
        // 3. Otherwise append new message
        return [...prev, message]
      })
    }
    const onMusicStateUpdated = (state) => setSharedMusicState(state)
    const onVideoStateUpdated = (state) => setSharedVideoState(state)
    const onLoveReaction = (data) => setLiveLoveReaction(data)

    newSocket.on('connect', onConnect)
    newSocket.on('partner_status_change', onPartnerStatus)
    newSocket.on('new_chat_message', onChatMessage)
    newSocket.on('music_state_updated', onMusicStateUpdated)
    newSocket.on('video_state_updated', onVideoStateUpdated)
    newSocket.on('love_reaction_received', onLoveReaction)

    setSocket(newSocket)

    return () => {
      newSocket.off('connect', onConnect)
      newSocket.off('partner_status_change', onPartnerStatus)
      newSocket.off('new_chat_message', onChatMessage)
      newSocket.off('music_state_updated', onMusicStateUpdated)
      newSocket.off('video_state_updated', onVideoStateUpdated)
      newSocket.off('love_reaction_received', onLoveReaction)
      newSocket.disconnect()
    }
  }, [user, spaceConnection?.connected])

  // Fetch real data from backend when user/space changes
  useEffect(() => {
    if (!user) {
      setSpecialDates([])
      setSpecialMoments([])
      setMemoryFolders([])
      setMemories([])
      setChatMessages([])
      setNotifications([])
      return
    }

    fetchDates()
    fetchMemoryFolders()
    fetchMemories()
    if (spaceConnection?.connected) {
      fetchChatMessages()
    }
    fetchNotifications()
  }, [user, spaceConnection?.connected])

  // --- REST API Actions ---

  const signup = async ({ firstName, email, password, confirmPassword }) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFetch('/auth/signup', {
        method: 'POST',
        body: { firstName, email, password, confirmPassword: confirmPassword || password },
      })
      setLoading(false)
      return res
    } catch (err) {
      setLoading(false)
      setError(err.message)
      throw err
    }
  }

  const login = async ({ email, password }) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      setLoading(false)
      return res
    } catch (err) {
      setLoading(false)
      setError(err.message)
      throw err
    }
  }

  const verifyOtp = async ({ email, otp }) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFetch('/auth/verify-otp', {
        method: 'POST',
        body: { email, otp },
      })

      if (res.token) {
        setToken(res.token)
      }
      if (res.user) {
        setUserState(res.user)
        try { sessionStorage.setItem('justus_session_user', JSON.stringify(res.user)) } catch (e) {}
      }
      if (res.spaceConnection) {
        setSpaceConnection(res.spaceConnection)
      }

      setLoading(false)
      return res
    } catch (err) {
      setLoading(false)
      setError(err.message)
      throw err
    }
  }

  const resendOtp = async ({ email }) => {
    try {
      return await apiFetch('/auth/resend-otp', {
        method: 'POST',
        body: { email },
      })
    } catch (err) {
      throw err
    }
  }

  const logout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' }).catch(() => null)
    } finally {
      clearSession()
      try { sessionStorage.removeItem('justus_session_user') } catch (e) {}
      setUserState(null)
      setSpaceConnection({ connected: false, code: null, partnerName: null, partnerEmail: null })
      if (socket) socket.disconnect()
    }
  }

  // Connection API
  const createConnectionCode = () => {
    return spaceConnection?.code || spaceConnection?.createdCode || user?.connectionCode || 'JUSTUS-8842'
  }

  const connectSpace = async (code) => {
    try {
      const res = await apiFetch('/space/connect', {
        method: 'POST',
        body: { code },
      })
      if (res.connected) {
        const updatedConn = {
          connected: true,
          code: res.code,
          partnerName: res.partnerName,
          partnerEmail: res.partnerEmail,
          connectedAt: res.connectedAt,
        }
        setSpaceConnection(updatedConn)
        if (socket) {
          socket.emit('join_space', { connectionId: res.code })
          socket.emit('get_room_state')
        }

        const syncPayload = { type: 'CONNECT', code: res.code, ts: Date.now() }
        try {
          const channel = new BroadcastChannel('justus_space_connection')
          channel.postMessage(syncPayload)
          channel.close()
        } catch (e) {}
        try {
          localStorage.setItem('justus_space_sync_event', JSON.stringify(syncPayload))
        } catch (e) {}
      }
      return res
    } catch (err) {
      throw err
    }
  }

  const disconnectSpace = async () => {
    try {
      const res = await apiFetch('/space/disconnect', { method: 'POST' })
      const disconnected = {
        connected: false,
        code: res.code || null,
        partnerName: null,
        partnerEmail: null,
      }
      setSpaceConnection(disconnected)
      setChatMessages([])
      setSharedMusicState(null)
      setSharedVideoState(null)

      const syncPayload = { type: 'DISCONNECT', ts: Date.now() }
      try {
        const channel = new BroadcastChannel('justus_space_connection')
        channel.postMessage(syncPayload)
        channel.close()
      } catch (e) {}
      try {
        localStorage.setItem('justus_space_sync_event', JSON.stringify(syncPayload))
      } catch (e) {}

      return res
    } catch (err) {
      throw err
    }
  }

  // Dates API
  const fetchDates = async () => {
    try {
      const res = await apiFetch('/dates')
      setSpecialDates(res.dates || [])
    } catch (err) {
      console.error('Error loading dates:', err)
    }
  }

  const addSpecialDate = async (dateData) => {
    try {
      const res = await apiFetch('/dates', {
        method: 'POST',
        body: dateData,
      })
      setSpecialDates((prev) => [...prev, res.date])
      return res.date
    } catch (err) {
      throw err
    }
  }

  const updateSpecialDate = async (id, dateData) => {
    try {
      const res = await apiFetch(`/dates/${id}`, {
        method: 'PUT',
        body: dateData,
      })
      setSpecialDates((prev) => prev.map((d) => (d._id === id ? res.date : d)))
      return res.date
    } catch (err) {
      throw err
    }
  }

  const removeSpecialDate = async (id) => {
    try {
      await apiFetch(`/dates/${id}`, { method: 'DELETE' })
      setSpecialDates((prev) => prev.filter((d) => d._id !== id))
    } catch (err) {
      throw err
    }
  }

  // Moments API
  const addSpecialMoment = (moment) => {
    setSpecialMoments((prev) => [moment, ...prev])
  }

  const updateSmsPreferences = (prefs) => {
    setSmsPreferences(prefs)
  }

  const incrementSongsShared = () => setSongsSharedCount((prev) => prev + 1)
  const incrementVideosWatched = () => setVideosWatchedCount((prev) => prev + 1)

  // Memories API
  const fetchMemoryFolders = async () => {
    try {
      const res = await apiFetch('/memories/folders')
      setMemoryFolders(res.folders || [])
    } catch (err) {
      console.error('Error loading memory folders:', err)
    }
  }

  const createMemoryFolder = async (name) => {
    try {
      const res = await apiFetch('/memories/folders', {
        method: 'POST',
        body: { name },
      })
      setMemoryFolders((prev) => [res.folder, ...prev])
      return res.folder
    } catch (err) {
      throw err
    }
  }

  const renameMemoryFolder = async (id, name) => {
    try {
      const res = await apiFetch(`/memories/folders/${id}`, {
        method: 'PUT',
        body: { name },
      })
      setMemoryFolders((prev) => prev.map((f) => (f._id === id ? { ...f, name: res.folder.name } : f)))
    } catch (err) {
      throw err
    }
  }

  const deleteMemoryFolder = async (id) => {
    try {
      await apiFetch(`/memories/folders/${id}`, { method: 'DELETE' })
      setMemoryFolders((prev) => prev.filter((f) => f._id !== id))
      setMemories((prev) => prev.filter((m) => m.folderId !== id))
    } catch (err) {
      throw err
    }
  }

  const fetchMemories = async (folderId) => {
    try {
      const path = folderId ? `/memories?folderId=${folderId}` : '/memories'
      const res = await apiFetch(path)
      setMemories(res.memories || [])
    } catch (err) {
      console.error('Error loading memories:', err)
    }
  }

  const uploadMemory = async (memoryData) => {
    try {
      const res = await apiFetch('/memories/upload', {
        method: 'POST',
        body: memoryData,
      })
      setMemories((prev) => [res.memory, ...prev])
      fetchMemoryFolders()
      return res.memory
    } catch (err) {
      throw err
    }
  }

  const toggleFavoriteMemory = async (id) => {
    try {
      const res = await apiFetch(`/memories/${id}/favorite`, { method: 'PUT' })
      setMemories((prev) => prev.map((m) => (m._id === id ? res.memory : m)))
    } catch (err) {
      throw err
    }
  }

  const deleteMemory = async (id) => {
    try {
      await apiFetch(`/memories/${id}`, { method: 'DELETE' })
      setMemories((prev) => prev.filter((m) => m._id !== id))
      fetchMemoryFolders()
    } catch (err) {
      throw err
    }
  }

  // Chat API - Always save to DB & notify socket
  const fetchChatMessages = async () => {
    try {
      const res = await apiFetch('/chat/messages')
      setChatMessages(res.messages || [])
    } catch (err) {
      console.error('Error fetching chat messages:', err)
    }
  }

  const sendChatMessage = async (text) => {
    const tempId = `temp_${Date.now()}`
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const optimisticMsg = {
      _id: tempId,
      text,
      sender: user,
      senderName: user?.firstName || 'User',
      time: timeStr,
      createdAt: new Date().toISOString(),
      self: true,
    }

    setChatMessages((prev) => [...prev, optimisticMsg])

    try {
      const res = await apiFetch('/chat/messages', {
        method: 'POST',
        body: { text },
      })

      if (res.message) {
        setChatMessages((prev) => {
          // If socket already added this message by _id, clean up the temp placeholder
          if (prev.some((m) => m._id === res.message._id)) {
            return prev.filter((m) => m._id !== tempId)
          }
          // Otherwise replace temp message with server message
          return prev.map((m) => (m._id === tempId ? res.message : m))
        })
      }

      return res
    } catch (err) {
      console.error('Error sending chat message:', err)
      setChatMessages((prev) => prev.filter((m) => m._id !== tempId))
      throw err
    }
  }

  // Real-time Action Triggers
  const sendMusicAction = (actionData) => {
    if (socket) {
      socket.emit('music_action', actionData)
    }
  }

  const sendVideoAction = (actionData) => {
    if (socket) {
      socket.emit('video_action', actionData)
    }
  }

  const requestRoomState = () => {
    if (socket) {
      socket.emit('get_room_state')
    }
  }

  const sendLoveReaction = (reaction = '❤️') => {
    if (socket) {
      socket.emit('send_love_reaction', { reaction })
    }
  }

  // Notifications API
  const fetchNotifications = async () => {
    try {
      const res = await apiFetch('/notifications')
      setNotifications(res.notifications || [])
    } catch (err) {
      console.error('Error fetching notifications:', err)
    }
  }

  const markNotificationAsRead = async (id) => {
    try {
      await apiFetch(`/notifications/${id}/read`, { method: 'PUT' })
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)))
    } catch (err) {
      console.error('Error marking notification read:', err)
    }
  }

  const markAllNotificationsAsRead = async () => {
    try {
      await apiFetch('/notifications/read-all', { method: 'PUT' })
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    } catch (err) {
      console.error('Error marking all notifications read:', err)
    }
  }

  // Persistent Global Shared Audio Engine State
  const globalAudioRef = useRef(null)
  const pendingSeekRef = useRef(null)
  const isSeekingRef = useRef(false)

  const [globalAudioTrack, setGlobalAudioTrack] = useState({
    id: 1,
    title: 'Acoustic Sunset (Online Stream)',
    artist: 'Melody Space Studio',
    duration: '6:12',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: '🎵',
  })
  const [globalIsPlaying, setGlobalIsPlaying] = useState(false)
  const [globalCurrentTime, setGlobalCurrentTime] = useState(0)
  const [globalDuration, setGlobalDuration] = useState(0)
  const [globalAutoplayBlocked, setGlobalAutoplayBlocked] = useState(false)

  const parseDurationString = (durStr) => {
    if (typeof durStr === 'number' && !isNaN(durStr) && durStr > 0) return durStr
    if (typeof durStr === 'string' && durStr.includes(':')) {
      const parts = durStr.split(':')
      const mins = parseInt(parts[0], 10) || 0
      const secs = parseInt(parts[1], 10) || 0
      return mins * 60 + secs
    }
    return 0
  }

  // 1. Primary Socket Music State Sync Effect (Runs globally regardless of active page)
  useEffect(() => {
    if (!sharedMusicState) return
    const { currentSong, isPlaying: remoteIsPlaying, currentTime: remoteTime, senderId, updatedAt } = sharedMusicState

    const currentUserId = user?._id?.toString() || user?.id?.toString() || ''
    const isSelfAction = currentUserId && senderId && senderId.toString() === currentUserId

    const audio = globalAudioRef.current
    if (audio) {
      if (currentSong && currentSong.src && currentSong.src !== globalAudioTrack?.src) {
        setGlobalAudioTrack(currentSong)
        audio.src = currentSong.src
        audio.load()
      }

      let targetTime = remoteTime || 0
      if (remoteIsPlaying && updatedAt) {
        targetTime += (Date.now() - updatedAt) / 1000
      }

      if (!isSelfAction) {
        if (audio.readyState >= 1) {
          if (Math.abs(audio.currentTime - targetTime) > 0.6) {
            audio.currentTime = targetTime
            setGlobalCurrentTime(targetTime)
          }
        } else {
          pendingSeekRef.current = targetTime
        }

        if (remoteIsPlaying) {
          const promise = audio.play()
          if (promise !== undefined) {
            promise
              .then(() => {
                setGlobalIsPlaying(true)
                setGlobalAutoplayBlocked(false)
              })
              .catch((err) => {
                console.warn('Global audio blocked by browser:', err)
                setGlobalIsPlaying(false)
                setGlobalAutoplayBlocked(true)
              })
          }
        } else {
          audio.pause()
          setGlobalIsPlaying(false)
          setGlobalAutoplayBlocked(false)
        }
      }
    }
  }, [sharedMusicState, user])

  // 2. Continuous 1-Second Real-Time Playback Clock & Drift Sync Engine
  useEffect(() => {
    if (!sharedMusicState || !sharedMusicState.isPlaying) return

    const syncInterval = setInterval(() => {
      const audio = globalAudioRef.current
      if (!audio) return

      const { currentTime: remoteTime, updatedAt, senderId } = sharedMusicState
      const currentUserId = user?._id?.toString() || user?.id?.toString() || ''
      const isSelfAction = currentUserId && senderId && senderId.toString() === currentUserId

      let liveTarget = remoteTime || 0
      if (updatedAt) {
        liveTarget += (Date.now() - updatedAt) / 1000
      }

      if (!isSeekingRef.current) {
        setGlobalCurrentTime(audio.currentTime)
        if (audio.duration && !isNaN(audio.duration)) {
          setGlobalDuration(audio.duration)
        }
      }

      if (!isSelfAction && audio.readyState >= 1 && Math.abs(audio.currentTime - liveTarget) > 0.6) {
        audio.currentTime = liveTarget
      }

      if (audio.paused && !globalAutoplayBlocked && !isSelfAction) {
        audio.play().then(() => setGlobalIsPlaying(true)).catch(() => {})
      }
    }, 1000)

    return () => clearInterval(syncInterval)
  }, [sharedMusicState, globalAutoplayBlocked, user])

  // 3. Global Mobile Touch Unlock (Unlocks browser audio context on touch across any route)
  useEffect(() => {
    const unlockAudioContext = () => {
      const audio = globalAudioRef.current
      if (audio && sharedMusicState && sharedMusicState.isPlaying && audio.paused) {
        let liveTarget = sharedMusicState.currentTime || 0
        if (sharedMusicState.updatedAt) {
          liveTarget += (Date.now() - sharedMusicState.updatedAt) / 1000
        }
        if (audio.readyState >= 1) {
          audio.currentTime = liveTarget
        } else {
          pendingSeekRef.current = liveTarget
        }
        setGlobalCurrentTime(liveTarget)
        audio
          .play()
          .then(() => {
            setGlobalIsPlaying(true)
            setGlobalAutoplayBlocked(false)
          })
          .catch(() => {})
      }
    }

    window.addEventListener('pointerdown', unlockAudioContext, { passive: true })
    window.addEventListener('touchstart', unlockAudioContext, { passive: true })

    return () => {
      window.removeEventListener('pointerdown', unlockAudioContext)
      window.removeEventListener('touchstart', unlockAudioContext)
    }
  }, [sharedMusicState])

  // Periodic Heartbeat
  useEffect(() => {
    if (!globalIsPlaying) return
    const heartbeatTimer = setInterval(() => {
      if (globalAudioRef.current && !globalAudioRef.current.paused) {
        sendMusicAction({
          action: 'HEARTBEAT',
          currentTime: globalAudioRef.current.currentTime,
        })
      }
    }, 4000)
    return () => clearInterval(heartbeatTimer)
  }, [globalIsPlaying])

  // --- HTML5 GLOBAL AUDIO HANDLERS ---
  const handleGlobalLoadedMetadata = (e) => {
    const dur = e.target.duration
    if (dur && !isNaN(dur)) setGlobalDuration(dur)
    if (pendingSeekRef.current !== null && e.target) {
      e.target.currentTime = pendingSeekRef.current
      setGlobalCurrentTime(pendingSeekRef.current)
      pendingSeekRef.current = null
    }
  }

  const handleGlobalDurationChange = (e) => {
    const dur = e.target.duration
    if (dur && !isNaN(dur)) setGlobalDuration(dur)
  }

  const handleGlobalCanPlay = (e) => {
    if (pendingSeekRef.current !== null && e.target) {
      e.target.currentTime = pendingSeekRef.current
      setGlobalCurrentTime(pendingSeekRef.current)
      pendingSeekRef.current = null
    }
  }

  const handleGlobalTimeUpdate = (e) => {
    if (!isSeekingRef.current && e.target) {
      setGlobalCurrentTime(e.target.currentTime)
      if (e.target.duration && !isNaN(e.target.duration)) {
        setGlobalDuration(e.target.duration)
      }
    }
  }

  // --- EXPORTED PLAYER CONTROLS ---

  const selectGlobalTrack = (track) => {
    const audio = globalAudioRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
      audio.src = track.src
      audio.load()
      audio.play().catch((err) => console.warn('Play error:', err))
    }
    setGlobalAudioTrack(track)
    setGlobalIsPlaying(true)
    setGlobalCurrentTime(0)
    sendMusicAction({
      action: 'SELECT_SONG',
      currentSong: track,
    })
    incrementSongsShared()
  }

  const toggleGlobalPlay = () => {
    const audio = globalAudioRef.current
    if (!audio) return

    if (globalIsPlaying || !audio.paused) {
      audio.pause()
      setGlobalIsPlaying(false)
      sendMusicAction({
        action: 'PAUSE',
        currentTime: audio.currentTime,
      })
    } else {
      const roomIsPlaying = sharedMusicState?.isPlaying
      let targetTime = audio.currentTime || globalCurrentTime || 0

      if (roomIsPlaying && sharedMusicState?.updatedAt) {
        targetTime = (sharedMusicState.currentTime || 0) + (Date.now() - sharedMusicState.updatedAt) / 1000
      }

      if (audio.readyState >= 1) {
        audio.currentTime = targetTime
      } else {
        pendingSeekRef.current = targetTime
      }
      setGlobalCurrentTime(targetTime)

      audio
        .play()
        .then(() => {
          setGlobalIsPlaying(true)
          setGlobalAutoplayBlocked(false)
          if (!roomIsPlaying) {
            sendMusicAction({
              action: 'PLAY',
              currentTime: targetTime,
            })
          }
        })
        .catch((err) => {
          console.warn('Play action blocked by browser:', err)
          setGlobalIsPlaying(false)
          setGlobalAutoplayBlocked(true)
        })
    }
  }

  const seekGlobalTrack = (newTime) => {
    const audio = globalAudioRef.current
    if (audio) {
      if (audio.readyState >= 1) {
        audio.currentTime = newTime
      } else {
        pendingSeekRef.current = newTime
      }
      setGlobalCurrentTime(newTime)
      sendMusicAction({
        action: 'SEEK',
        currentTime: newTime,
      })
    }
  }

  const skipGlobalTrack = (seconds) => {
    const audio = globalAudioRef.current
    if (audio) {
      const dur = audio.duration || globalDuration || parseDurationString(globalAudioTrack?.duration) || 100
      const currentPos = audio.currentTime || globalCurrentTime || 0
      const newTime = Math.max(0, Math.min(dur, currentPos + seconds))
      seekGlobalTrack(newTime)
    }
  }

  const uploadAndPlayGlobalTrack = async (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      const fileData = reader.result
      try {
        const res = await apiFetch('/music/upload', {
          method: 'POST',
          body: {
            fileName: file.name,
            fileData,
          },
        })

        if (res && res.url) {
          const uploadedTrack = {
            id: Date.now(),
            title: file.name.replace(/\.[^/.]+$/, ''),
            artist: 'Uploaded Shared Track',
            duration: 'Shared Track',
            src: res.url,
            cover: '📂',
          }
          selectGlobalTrack(uploadedTrack)
        }
      } catch (err) {
        console.error('File upload error:', err)
      }
    }
    reader.readAsDataURL(file)
  }

  const relationshipStats = {
    daysConnected: spaceConnection?.connectedAt
      ? Math.max(1, Math.floor((Date.now() - new Date(spaceConnection.connectedAt).getTime()) / (1000 * 60 * 60 * 24)))
      : 0,
    songsShared: songsSharedCount,
    videosWatched: videosWatchedCount,
    memoriesSaved: memories.length,
  }

  const value = {
    user,
    spaceConnection,
    loading,
    error,
    socket,
    partnerStatus,

    sharedMusicState,
    sharedVideoState,
    liveLoveReaction,

    // Persistent Global Audio Engine Context Exports
    globalAudioRef,
    globalAudioTrack,
    globalIsPlaying,
    globalCurrentTime,
    globalDuration: globalDuration || parseDurationString(globalAudioTrack?.duration) || 100,
    globalAutoplayBlocked,
    selectGlobalTrack,
    toggleGlobalPlay,
    seekGlobalTrack,
    skipGlobalTrack,
    uploadAndPlayGlobalTrack,
    setGlobalAutoplayBlocked,

    signup,
    login,
    verifyOtp,
    resendOtp,
    logout,

    createConnectionCode,
    connectSpace,
    disconnectSpace,

    smsPreferences,
    updateSmsPreferences,
    specialMoments,
    addSpecialMoment,
    relationshipStats,
    incrementSongsShared,
    incrementVideosWatched,

    specialDates,
    addSpecialDate,
    updateSpecialDate,
    removeSpecialDate,

    memoryFolders,
    memories,
    fetchMemoryFolders,
    createMemoryFolder,
    renameMemoryFolder,
    deleteMemoryFolder,
    fetchMemories,
    uploadMemory,
    toggleFavoriteMemory,
    deleteMemory,

    chatMessages,
    sendChatMessage,
    fetchChatMessages,

    sendMusicAction,
    sendVideoAction,
    requestRoomState,
    sendLoveReaction,

    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  }

  return (
    <AuthContext.Provider value={value}>
      {/* PERSISTENT HTML5 AUDIO ELEMENT (MOUNTED AT APP ROOT) */}
      <audio
        ref={globalAudioRef}
        src={globalAudioTrack?.src}
        preload="auto"
        crossOrigin="anonymous"
        onLoadedMetadata={handleGlobalLoadedMetadata}
        onDurationChange={handleGlobalDurationChange}
        onCanPlay={handleGlobalCanPlay}
        onTimeUpdate={handleGlobalTimeUpdate}
        onEnded={() => setGlobalIsPlaying(false)}
      />
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

