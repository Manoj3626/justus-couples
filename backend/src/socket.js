const jwt = require('jsonwebtoken')
const User = require('./models/User')
const Connection = require('./models/Connection')
const ChatMessage = require('./models/ChatMessage')
const Notification = require('./models/Notification')

const activeUsers = new Map() // userId -> socket.id

// In-memory room state single sources of truth (keyed by connectionId string)
const roomMusicState = new Map() // connectionId -> { currentSong, isPlaying, currentTime, selectedBy, updatedAt }
const roomVideoState = new Map() // connectionId -> { currentVideo, isPlaying, currentTime, selectedBy, updatedAt }

function setupSocketIO(io) {
  // Middleware for socket authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization
      if (!token) {
        return next(new Error('Authentication error: No token provided'))
      }

      const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token
      const secret = process.env.JWT_SECRET || 'dev_jwt_secret_change_me'
      const decoded = jwt.verify(cleanToken, secret)

      const user = await User.findById(decoded.id).select('-password')
      if (!user) {
        return next(new Error('Authentication error: User not found'))
      }

      socket.user = user
      next()
    } catch (err) {
      return next(new Error('Authentication error: Invalid session token'))
    }
  })

  io.on('connection', (socket) => {
    const user = socket.user
    const userId = user._id.toString()
    activeUsers.set(userId, socket.id)

    console.log(`🔌 Socket connected: User ${user.firstName} (${userId})`)

    const resolveConnId = async () => {
      if (user.connectionId) return user.connectionId.toString()
      const fresh = await User.findById(user._id)
      if (fresh && fresh.connectionId) {
        user.connectionId = fresh.connectionId
        return fresh.connectionId.toString()
      }
      const conn = await Connection.findOne({
        $or: [{ user1: user._id }, { user2: user._id }],
        status: 'CONNECTED',
      })
      if (conn) {
        user.connectionId = conn._id
        await User.findByIdAndUpdate(user._id, { connectionId: conn._id }).catch(() => null)
        return conn._id.toString()
      }
      return null
    }

    const getCalculatedState = (state) => {
      if (!state) return null
      let calcTime = state.currentTime || 0
      if (state.isPlaying && state.updatedAt) {
        calcTime += (Date.now() - state.updatedAt) / 1000
      }
      return {
        ...state,
        currentTime: calcTime,
      }
    }

    // Function to handle joining space room safely
    const joinUserRoom = async (inputConnId) => {
      const connId = inputConnId || (await resolveConnId())
      if (!connId) return
      const spaceRoom = `space_${connId}`
      socket.join(spaceRoom)
      console.log(`❤️ User ${user.firstName} joined room ${spaceRoom}`)

      // Emit current calculated room states to joining client
      if (roomMusicState.has(connId)) {
        socket.emit('music_state_updated', getCalculatedState(roomMusicState.get(connId)))
      }
      if (roomVideoState.has(connId)) {
        socket.emit('video_state_updated', getCalculatedState(roomVideoState.get(connId)))
      }

      socket.to(spaceRoom).emit('partner_status_change', { isOnline: true, userId })
    }

    resolveConnId().then((connId) => {
      if (connId) joinUserRoom(connId)
    })

    // Join explicit room event with verification
    socket.on('join_space', async ({ connectionId }) => {
      if (connectionId) user.connectionId = connectionId
      joinUserRoom(connectionId ? connectionId.toString() : null)
    })

    // Fetch current room state request
    socket.on('get_room_state', async () => {
      const rawConnId = await resolveConnId()
      if (!rawConnId) return
      const connId = rawConnId.toString()
      if (roomMusicState.has(connId)) {
        socket.emit('music_state_updated', getCalculatedState(roomMusicState.get(connId)))
      }
      if (roomVideoState.has(connId)) {
        socket.emit('video_state_updated', getCalculatedState(roomVideoState.get(connId)))
      }
    })

    // --- REALTIME CHAT ---
    socket.on('send_chat_message', async ({ text, connectionId }) => {
      try {
        if (!text || !text.trim()) return
        const rawConnId = await resolveConnId()
        if (!rawConnId) return
        const connId = rawConnId.toString()

        const spaceRoom = `space_${connId}`
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        const newMsg = new ChatMessage({
          connectionId: connId,
          sender: user._id,
          senderId: user._id,
          senderName: user.firstName || 'User',
          text: text.trim(),
          time: timeStr,
        })

        await newMsg.save()
        const populatedMsg = await ChatMessage.findById(newMsg._id).populate('sender', 'firstName email')

        io.to(spaceRoom).emit('new_chat_message', populatedMsg)

        if (user.partnerId) {
          await Notification.create({
            user: user.partnerId,
            connectionId: connId,
            title: 'New Chat Message',
            message: `${user.firstName}: ${text.trim().slice(0, 30)}...`,
            type: 'chat',
          })
        }
      } catch (err) {
        console.error('Socket chat message error:', err)
      }
    })

    // --- AUTHORITATIVE MUSIC SYNC (ONE SONG ACTIVE PER ROOM) ---
    socket.on('music_action', async (data) => {
      try {
        const rawConnId = await resolveConnId()
        if (!rawConnId || !data) return
        const connId = rawConnId.toString()
        const spaceRoom = `space_${connId}`
        const actionType = data.action || data.type || 'PLAY'

        let state = roomMusicState.get(connId) || {
          currentSong: null,
          isPlaying: false,
          currentTime: 0,
          selectedBy: null,
          updatedAt: Date.now(),
        }

        if (actionType === 'SELECT_SONG' || actionType === 'CHANGE_TRACK') {
          state = {
            currentSong: data.currentSong || data.track || data.song,
            isPlaying: true,
            currentTime: 0,
            selectedBy: user.firstName,
            updatedAt: Date.now(),
          }
        } else if (actionType === 'PLAY') {
          state.isPlaying = true
          if (data.currentTime !== undefined) state.currentTime = data.currentTime
          state.updatedAt = Date.now()
        } else if (actionType === 'PAUSE') {
          state.isPlaying = false
          if (data.currentTime !== undefined) state.currentTime = data.currentTime
          state.updatedAt = Date.now()
        } else if (actionType === 'SEEK') {
          if (data.currentTime !== undefined) state.currentTime = data.currentTime
          state.updatedAt = Date.now()
        } else if (actionType === 'HEARTBEAT') {
          if (data.currentTime !== undefined) state.currentTime = data.currentTime
          state.updatedAt = Date.now()
        }

        roomMusicState.set(connId, state)

        io.to(spaceRoom).emit('music_state_updated', {
          ...state,
          senderId: userId,
          senderName: user.firstName,
          action: actionType,
        })
      } catch (err) {
        console.error('Socket music action error:', err)
      }
    })

    // --- AUTHORITATIVE VIDEO SYNC (ONE VIDEO ACTIVE PER ROOM) ---
    socket.on('video_action', async (data) => {
      try {
        const connId = await resolveConnId()
        if (!connId || !data) return
        const spaceRoom = `space_${connId}`
        const actionType = data.action || data.type || 'PLAY'

        let state = roomVideoState.get(connId) || {
          currentVideo: null,
          isPlaying: false,
          currentTime: 0,
          selectedBy: null,
          updatedAt: Date.now(),
        }

        if (actionType === 'SELECT_VIDEO') {
          state = {
            currentVideo: data.currentVideo || data.video || { title: data.videoTitle, src: data.videoSrc },
            isPlaying: true,
            currentTime: 0,
            selectedBy: user.firstName,
            updatedAt: Date.now(),
          }
        } else if (actionType === 'PLAY') {
          state.isPlaying = true
          if (data.currentTime !== undefined) state.currentTime = data.currentTime
          state.updatedAt = Date.now()
        } else if (actionType === 'PAUSE') {
          state.isPlaying = false
          if (data.currentTime !== undefined) state.currentTime = data.currentTime
          state.updatedAt = Date.now()
        } else if (actionType === 'SEEK') {
          if (data.currentTime !== undefined) state.currentTime = data.currentTime
          state.updatedAt = Date.now()
        }

        roomVideoState.set(connId, state)

        io.to(spaceRoom).emit('video_state_updated', getCalculatedState({
          ...state,
          senderId: userId,
          senderName: user.firstName,
          action: actionType,
        }))
      } catch (err) {
        console.error('Socket video action error:', err)
      }
    })

    // --- REALTIME LOVE REACTION ---
    socket.on('send_love_reaction', async (data) => {
      if (!user.connectionId) return
      const spaceRoom = `space_${user.connectionId}`
      socket.to(spaceRoom).emit('love_reaction_received', {
        senderId: userId,
        senderName: user.firstName,
        reaction: data?.reaction || '❤️',
        timestamp: new Date(),
      })

      if (user.partnerId) {
        await Notification.create({
          user: user.partnerId,
          connectionId: user.connectionId,
          title: 'Love Reaction ❤️',
          message: `${user.firstName} sent you a love reaction!`,
          type: 'love_reaction',
        })
      }
    })

    // Handle Disconnect
    socket.on('disconnect', () => {
      activeUsers.delete(userId)
      console.log(`🔌 Socket disconnected: User ${user.firstName} (${userId})`)
      if (user.connectionId) {
        const spaceRoom = `space_${user.connectionId}`
        socket.to(spaceRoom).emit('partner_status_change', { isOnline: false, userId })
      }
    })
  })
}

module.exports = { setupSocketIO }
