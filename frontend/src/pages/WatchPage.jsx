import React, { useState, useRef, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import ChatPanel from '../components/ChatPanel'
import { useAuth } from '../contexts/AuthContext'
import { apiFetch } from '../services/api'

export default function WatchPage() {
  const {
    user,
    spaceConnection,
    incrementVideosWatched,
    sendVideoAction,
    sharedVideoState,
    requestRoomState,
  } = useAuth()

  const partnerName = spaceConnection?.partnerName || 'Partner'
  const currentUserId = user?._id?.toString() || user?.id?.toString() || ''

  const videoRef = useRef(null)
  const videoInputRef = useRef(null)
  const isSeekingRef = useRef(false)

  const demoVideos = [
    { id: 1, title: 'Big Buck Bunny (Testing Movie Stream)', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
    { id: 2, title: 'For Bigger Blazes (Sample Stream)', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
    { id: 3, title: 'Tears of Steel (Action Stream)', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
  ]

  const [currentVideo, setCurrentVideo] = useState(demoVideos[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)

  const [syncStatus, setSyncStatus] = useState('Room Sync Active')
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showChatInFullscreen, setShowChatInFullscreen] = useState(true)
  const [activeMobileTab, setActiveMobileTab] = useState('player')
  const [reaction, setReaction] = useState(null)

  // On Mount: Request room state from server & cleanup on unmount
  useEffect(() => {
    requestRoomState?.()
    return () => {
      if (videoRef.current) {
        videoRef.current.pause()
      }
    }
  }, [])

  // 1. Authoritative Room Video State Sync
  useEffect(() => {
    if (!sharedVideoState) return
    const { currentVideo: remoteVideo, isPlaying: remoteIsPlaying, currentTime: remoteTime, selectedBy, senderId, updatedAt } = sharedVideoState

    const isSelfAction = currentUserId && senderId && senderId.toString() === currentUserId

    if (selectedBy) {
      setSyncStatus(`Active Video Selected by ${selectedBy}`)
    }

    const video = videoRef.current
    if (video) {
      let srcChanged = false
      if (remoteVideo && remoteVideo.src && remoteVideo.src !== currentVideo.src) {
        setCurrentVideo(remoteVideo)
        video.src = remoteVideo.src
        video.load()
        srcChanged = true
        setIsLoading(true)
        setHasError(false)
      }

      let liveTarget = remoteTime || 0
      if (remoteIsPlaying && updatedAt) {
        liveTarget += (Date.now() - updatedAt) / 1000
      }

      if (!isSelfAction && video.readyState >= 1) {
        if (Math.abs(video.currentTime - liveTarget) > 0.8) {
          video.currentTime = liveTarget
          setCurrentTime(liveTarget)
        }
      }

      if (remoteIsPlaying) {
        const attemptPlay = () => {
          const promise = video.play()
          if (promise !== undefined) {
            promise
              .then(() => {
                setIsPlaying(true)
                setAutoplayBlocked(false)
                setIsLoading(false)
              })
              .catch((err) => {
                console.warn('Video playback restricted by browser policy:', err)
                setIsPlaying(false)
                if (!isSelfAction) {
                  setAutoplayBlocked(true)
                }
              })
          }
        }

        if (srcChanged) {
          if (video.readyState >= 3) {
            attemptPlay()
          } else {
            video.addEventListener('canplay', attemptPlay, { once: true })
          }
        } else if (!isSelfAction) {
          attemptPlay()
        }
      } else if (!isSelfAction) {
        video.pause()
        setIsPlaying(false)
        setAutoplayBlocked(false)
      }
    }
  }, [sharedVideoState, user])

  // 2. Continuous 1-Second Realtime Clock & Drift Sync Engine
  useEffect(() => {
    if (!sharedVideoState || !sharedVideoState.isPlaying) return

    const syncInterval = setInterval(() => {
      const video = videoRef.current
      if (!video) return

      const { currentTime: remoteTime, updatedAt, senderId } = sharedVideoState
      const isSelfAction = currentUserId && senderId && senderId.toString() === currentUserId

      let liveTarget = remoteTime || 0
      if (updatedAt) {
        liveTarget += (Date.now() - updatedAt) / 1000
      }

      if (!isSeekingRef.current) {
        setCurrentTime(video.currentTime)
        if (video.duration && !isNaN(video.duration)) {
          setDuration(video.duration)
        }
      }

      if (!isSelfAction && video.readyState >= 1 && Math.abs(video.currentTime - liveTarget) > 0.8) {
        video.currentTime = liveTarget
      }

      if (video.paused && !autoplayBlocked && !isSelfAction) {
        video.play().then(() => setIsPlaying(true)).catch(() => {})
      }
    }, 1000)

    return () => clearInterval(syncInterval)
  }, [sharedVideoState, autoplayBlocked, user])

  // 3. Pointer/Touch Unlock Handler for Restricted Autoplay Contexts
  useEffect(() => {
    const unlockVideoContext = () => {
      const video = videoRef.current
      if (video && sharedVideoState && sharedVideoState.isPlaying && video.paused) {
        let liveTarget = sharedVideoState.currentTime || 0
        if (sharedVideoState.updatedAt) {
          liveTarget += (Date.now() - sharedVideoState.updatedAt) / 1000
        }
        if (video.readyState >= 1) {
          video.currentTime = liveTarget
        }
        setCurrentTime(liveTarget)
        video
          .play()
          .then(() => {
            setIsPlaying(true)
            setAutoplayBlocked(false)
          })
          .catch(() => {})
      }
    }

    window.addEventListener('pointerdown', unlockVideoContext, { passive: true })
    window.addEventListener('touchstart', unlockVideoContext, { passive: true })

    return () => {
      window.removeEventListener('pointerdown', unlockVideoContext)
      window.removeEventListener('touchstart', unlockVideoContext)
    }
  }, [sharedVideoState])

  // --- USER CONTROLS ---

  const handleSelectVideo = (video) => {
    const v = videoRef.current
    if (v) {
      v.pause()
      v.currentTime = 0
      v.src = video.src
      v.load()
      v.play().catch((e) => console.warn('Video play error:', e))
    }
    setCurrentVideo(video)
    setIsPlaying(true)
    setIsLoading(true)
    setHasError(false)
    sendVideoAction?.({
      action: 'SELECT_VIDEO',
      currentVideo: video,
    })
    incrementVideosWatched?.()
  }

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (isPlaying || !video.paused) {
      video.pause()
      setIsPlaying(false)
      sendVideoAction?.({
        action: 'PAUSE',
        currentTime: video.currentTime,
      })
    } else {
      video
        .play()
        .then(() => {
          setIsPlaying(true)
          setAutoplayBlocked(false)
          sendVideoAction?.({
            action: 'PLAY',
            currentTime: video.currentTime,
          })
        })
        .catch((err) => {
          console.warn('Video play action blocked by browser:', err)
          setAutoplayBlocked(true)
        })
    }
  }

  const handleSeek = (newTime) => {
    const video = videoRef.current
    if (video) {
      video.currentTime = newTime
      setCurrentTime(newTime)
      sendVideoAction?.({
        action: 'SEEK',
        currentTime: newTime,
      })
    }
  }

  const skipVideo = (seconds) => {
    const video = videoRef.current
    if (video) {
      const dur = video.duration || duration || 100
      const currentPos = video.currentTime || currentTime || 0
      const targetTime = Math.max(0, Math.min(dur, currentPos + seconds))
      handleSeek(targetTime)
    }
  }

  const handleVolumeChange = (newVol) => {
    setVolume(newVol)
    setIsMuted(newVol === 0)
    if (videoRef.current) {
      videoRef.current.volume = newVol
      videoRef.current.muted = newVol === 0
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    const nextMute = !isMuted
    setIsMuted(nextMute)
    videoRef.current.muted = nextMute
  }

  const handleTimeUpdate = () => {
    if (videoRef.current && !isSeekingRef.current) {
      setCurrentTime(videoRef.current.currentTime)
      if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
        setDuration(videoRef.current.duration)
      }
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setHasError(false)

    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const fileData = reader.result
        const res = await apiFetch('/music/upload', {
          method: 'POST',
          body: {
            fileName: file.name,
            fileData,
          },
        })

        if (res && res.url) {
          const uploadedVideo = {
            id: Date.now(),
            title: `📂 ${file.name}`,
            src: res.url,
          }
          handleSelectVideo(uploadedVideo)
        }
      } catch (err) {
        console.error('Video file upload error:', err)
        setIsLoading(false)
        setHasError(true)
      }
    }
    reader.readAsDataURL(file)
  }

  const formatTime = (timeInSec) => {
    if (isNaN(timeInSec) || timeInSec === null || timeInSec === undefined || timeInSec < 0) return '0:00'
    const mins = Math.floor(timeInSec / 60)
    const secs = Math.floor(timeInSec % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const triggerReaction = (emoji) => {
    setReaction(emoji)
    setTimeout(() => setReaction(null), 2500)
  }

  // --- RENDER VIDEO PLAYER CONTROLS & MEDIA DISPLAY ---
  const renderPlayer = (inFullscreen = false) => (
    <div className={`relative bg-black rounded-3xl overflow-hidden shadow-2xl flex flex-col border-4 border-white ${inFullscreen ? 'w-full h-full rounded-none border-none' : ''}`}>
      <div className={`relative bg-neutral-950 flex items-center justify-center ${inFullscreen ? 'flex-1' : 'aspect-video'}`}>
        <video
          ref={videoRef}
          src={currentVideo.src}
          onTimeUpdate={handleTimeUpdate}
          onWaiting={() => setIsLoading(true)}
          onPlaying={() => {
            setIsLoading(false)
            setIsPlaying(true)
          }}
          onCanPlay={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false)
            setHasError(true)
          }}
          onEnded={() => setIsPlaying(false)}
          className="w-full h-full object-contain"
        />

        {/* Loading Spinner Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white z-20">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 border-4 border-[#C44569] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-semibold">Buffering video stream...</span>
            </div>
          </div>
        )}

        {/* Error Fallback */}
        {hasError && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center text-white z-20 p-4 text-center">
            <div className="space-y-3">
              <div className="text-3xl">⚠️</div>
              <h4 className="text-sm font-bold">Video Playback Error</h4>
              <p className="text-xs text-white/70">Failed to load video stream source.</p>
              <button
                onClick={() => handleSelectVideo(currentVideo)}
                className="px-4 py-2 bg-[#C44569] hover:bg-[#9E3155] rounded-xl text-xs font-bold text-white transition-colors"
              >
                Retry Stream
              </button>
            </div>
          </div>
        )}

        {/* Emoji Floating Reaction */}
        {reaction && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-bounce text-7xl">
            {reaction}
          </div>
        )}
      </div>

      {/* Video Controls Bar */}
      <div className="p-4 bg-gradient-to-t from-black via-black/80 to-transparent text-white space-y-3 shrink-0">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold truncate max-w-[280px] sm:max-w-md">{currentVideo.title}</span>
          <span className="font-mono text-[11px] font-semibold text-white/80">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Progress Bar */}
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={isNaN(currentTime) ? 0 : currentTime}
          onMouseDown={() => { isSeekingRef.current = true }}
          onTouchStart={() => { isSeekingRef.current = true }}
          onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
          onMouseUp={(e) => {
            handleSeek(parseFloat(e.target.value))
            setTimeout(() => { isSeekingRef.current = false }, 300)
          }}
          onTouchEnd={(e) => {
            handleSeek(parseFloat(e.target.value))
            setTimeout(() => { isSeekingRef.current = false }, 300)
          }}
          className="w-full accent-[#C44569] cursor-pointer h-2"
        />

        {/* Control Buttons */}
        <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {/* Rewind -10s */}
            <button
              onClick={() => skipVideo(-10)}
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center text-xs font-bold transition-all"
              title="Rewind 10 seconds"
            >
              ⏪ 10s
            </button>

            {/* Play / Pause */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-[#C44569] hover:bg-[#9E3155] text-white flex items-center justify-center text-lg hover:scale-105 transition-all shadow-md"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>

            {/* Forward +10s */}
            <button
              onClick={() => skipVideo(10)}
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center text-xs font-bold transition-all"
              title="Forward 10 seconds"
            >
              10s ⏩
            </button>

            {/* Volume & Mute Controls */}
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md ml-1">
              <button
                onClick={toggleMute}
                className="text-sm text-white/90 hover:text-white transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-16 accent-[#C44569] cursor-pointer h-1.5"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Emoji Reactions */}
            <div className="hidden sm:flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full backdrop-blur-md">
              {['❤️', '😂', '😮', '🍿', '👏'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => triggerReaction(emoji)}
                  className="p-1 rounded-full hover:bg-white/20 text-base transition-transform hover:scale-125"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Independent Full Screen Toggle */}
            <button
              onClick={() => setIsFullscreen(!inFullscreen)}
              className="px-3.5 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-md"
            >
              <span>{inFullscreen ? '🗗 Exit' : '⛶ Full Screen'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <AppLayout>
      <input
        type="file"
        ref={videoInputRef}
        onChange={handleFileChange}
        accept="video/*"
        className="hidden"
      />

      {/* FULL SCREEN OVERLAY (INDEPENDENT PER USER) */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col md:flex-row overflow-hidden animate-fadeIn">
          {/* Main Video View in Fullscreen */}
          <div className="flex-1 flex flex-col relative h-full">
            {renderPlayer(true)}

            {/* Floating Top Header Bar */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30 pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white text-xs font-bold flex items-center gap-2 pointer-events-auto">
                <span className="animate-pulse">🟢</span>
                <span>Watch Together • {partnerName}</span>
              </div>

              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  onClick={() => setShowChatInFullscreen(!showChatInFullscreen)}
                  className="px-4 py-2 rounded-full bg-[#681F3B] hover:bg-[#9E3155] text-white text-xs font-bold shadow-lg transition-all flex items-center gap-1.5"
                >
                  <span>💬</span>
                  <span>{showChatInFullscreen ? 'Hide Chat' : 'Show Chat'}</span>
                </button>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold shadow-lg backdrop-blur-md transition-all"
                >
                  ✕ Exit Full Screen
                </button>
              </div>
            </div>
          </div>

          {/* Side Overlay Chat in Fullscreen Mode */}
          {showChatInFullscreen && (
            <div className="w-full md:w-80 lg:w-96 h-64 md:h-full shrink-0 border-t md:border-t-0 md:border-l border-white/10">
              <ChatPanel onClose={() => setShowChatInFullscreen(false)} title="Live Watch Chat" variant="dark" />
            </div>
          )}
        </div>
      )}

      {/* MAIN NORMAL VIEW */}
      <div className="space-y-6 animate-fadeIn pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0F4] border border-[#F7DDE4] text-xs font-semibold text-[#C44569] mb-2">
              <span className="animate-pulse">🟢</span> {syncStatus}
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#681F3B]">
              Watch <span className="text-[#C44569]">Together</span> 🎬
            </h1>
            <p className="text-xs text-[#75676E] mt-1">
              One single active video plays for both you and {partnerName}. Selecting a new video automatically switches both of you!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(true)}
              className="px-4 py-2.5 rounded-full bg-[#681F3B] hover:bg-[#9E3155] text-white shadow-md text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <span>⛶ Full Screen</span>
            </button>
            <button
              onClick={() => videoInputRef.current?.click()}
              className="px-4 py-2.5 rounded-full bg-white border border-[#F7DDE4] shadow-sm hover:border-[#C44569] text-xs font-semibold text-[#681F3B] flex items-center justify-center gap-2 transition-all"
            >
              <span>📁 Open Local Video File</span>
            </button>
          </div>
        </div>

        {/* MOBILE VIEW TOGGLE TABS */}
        <div className="lg:hidden flex bg-[#FFF0F4] p-1 rounded-2xl border border-[#F7DDE4]">
          <button
            onClick={() => setActiveMobileTab('player')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeMobileTab === 'player'
                ? 'bg-white text-[#681F3B] shadow-xs'
                : 'text-[#75676E] hover:text-[#681F3B]'
            }`}
          >
            🎬 Video Player
          </button>
          <button
            onClick={() => setActiveMobileTab('chat')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeMobileTab === 'chat'
                ? 'bg-[#681F3B] text-white shadow-xs'
                : 'text-[#75676E] hover:text-[#681F3B]'
            }`}
          >
            <span>💬 Live Chat</span>
          </button>
        </div>

        {/* MOBILE AUTOPLAY BANNER */}
        {autoplayBlocked && (
          <button
            onClick={() => {
              setAutoplayBlocked(false)
              if (videoRef.current) {
                videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
              }
            }}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#681F3B] to-[#9E3155] text-white text-xs font-bold flex items-center justify-between shadow-xl animate-pulse cursor-pointer border border-[#F7DDE4]"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🎬</span>
              <span className="text-left">
                {partnerName} is playing "{currentVideo.title}". Tap here to start video playback on your device!
              </span>
            </div>
            <span className="bg-white text-[#681F3B] px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 shadow-sm ml-2">
              Tap to Play ▶
            </span>
          </button>
        )}

        {/* MAIN GRID VIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Player & Video Queue */}
          <div className={`lg:col-span-7 space-y-6 ${activeMobileTab === 'chat' ? 'hidden lg:block' : ''}`}>
            {renderPlayer(false)}

            {/* Video Selector Queue */}
            <div className="bg-white rounded-3xl p-6 border border-[#F7DDE4] shadow-xl">
              <h3 className="text-sm font-serif font-bold text-[#681F3B] mb-3 flex items-center justify-between">
                <span>🎬 Stream Videos</span>
                <span className="text-xs text-[#75676E] font-normal">{demoVideos.length} Available</span>
              </h3>
              <div className="space-y-2.5">
                {demoVideos.map((vid) => {
                  const isSelected = vid.src === currentVideo.src
                  return (
                    <button
                      key={vid.id}
                      onClick={() => handleSelectVideo(vid)}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#FFF0F4] border-[#C44569] text-[#681F3B] font-bold shadow-xs'
                          : 'border-[#F7DDE4] hover:bg-[#FFF9F7] text-[#75676E]'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate pr-2">
                        <span className="text-lg">🎬</span>
                        <span className="truncate">{vid.title}</span>
                      </div>
                      {isSelected ? (
                        <span className="bg-[#C44569] text-white px-2.5 py-1 rounded-full text-[10px] font-bold">
                          ▶ Active
                        </span>
                      ) : (
                        <span className="text-[#C44569] font-bold text-xs">Play ▶</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Canonical ChatPanel Component */}
          <div className={`lg:col-span-5 h-[620px] ${activeMobileTab === 'player' ? 'hidden lg:block' : ''}`}>
            <ChatPanel title="Live Shared Chat" variant="light" />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
