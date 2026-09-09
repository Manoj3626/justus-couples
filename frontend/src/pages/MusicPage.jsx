import React, { useState, useRef, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import ChatPanel from '../components/ChatPanel'
import { useAuth } from '../contexts/AuthContext'

export default function MusicPage() {
  const {
    spaceConnection,
    sharedMusicState,
    requestRoomState,
    globalAudioTrack,
    globalIsPlaying,
    globalCurrentTime,
    globalDuration,
    globalAutoplayBlocked,
    selectGlobalTrack,
    toggleGlobalPlay,
    seekGlobalTrack,
    skipGlobalTrack,
    uploadAndPlayGlobalTrack,
    setGlobalAutoplayBlocked,
  } = useAuth()

  const partnerName = spaceConnection?.partnerName || 'Partner'
  const fileInputRef = useRef(null)

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showChatInFullscreen, setShowChatInFullscreen] = useState(true)
  const [activeMobileTab, setActiveMobileTab] = useState('player') // 'player' or 'chat'
  const [isSeeking, setIsSeeking] = useState(false)
  const [localSeekTime, setLocalSeekTime] = useState(0)

  // Default playable online songs list
  const ONLINE_SONGS = [
    {
      id: 1,
      title: 'Acoustic Sunset (Online Stream)',
      artist: 'Melody Space Studio',
      duration: '6:12',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      cover: '🎵',
    },
    {
      id: 2,
      title: 'Romantic Serenade (Online Stream)',
      artist: 'Love Harmony',
      duration: '7:05',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      cover: '💖',
    },
    {
      id: 3,
      title: 'Starlight Dreams (Online Stream)',
      artist: 'Midnight Chill',
      duration: '5:44',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      cover: '✨',
    },
    {
      id: 4,
      title: 'Midnight Melody (Online Stream)',
      artist: 'JustUs Acoustic Sessions',
      duration: '6:30',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      cover: '🌙',
    },
    {
      id: 5,
      title: 'Sweet Harmony (Online Stream)',
      artist: 'Sweet Beats',
      duration: '7:18',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      cover: '🎶',
    },
  ]

  const [queue, setQueue] = useState(ONLINE_SONGS)

  // On Mount: Request latest room state
  useEffect(() => {
    requestRoomState?.()
  }, [])

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadAndPlayGlobalTrack(file)
    }
  }

  const formatTime = (timeInSec) => {
    if (isNaN(timeInSec) || timeInSec === null || timeInSec === undefined || timeInSec < 0) return '0:00'
    const mins = Math.floor(timeInSec / 60)
    const secs = Math.floor(timeInSec % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const sliderTime = isSeeking ? localSeekTime : globalCurrentTime

  return (
    <AppLayout>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="audio/*"
        className="hidden"
      />

      <div className="space-y-6 animate-fadeIn pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0F4] border border-[#F7DDE4] text-xs font-semibold text-[#C44569] mb-2">
              <span className="animate-pulse">🟢</span> Room Sync Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#681F3B]">
              Shared <span className="text-[#C44569]">Music Player</span> 🎵
            </h1>
            <p className="text-xs text-[#75676E] mt-1">
              One single active song plays for both you and {partnerName}. Navigating away keeps music playing seamlessly in the background!
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
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 rounded-full bg-white border border-[#F7DDE4] shadow-sm hover:border-[#C44569] text-xs font-semibold text-[#681F3B] flex items-center justify-center gap-2 transition-all"
            >
              <span>📂 Open Audio File</span>
            </button>
          </div>
        </div>

        {/* MOBILE VIEW TOGGLE TABS (Visible only on small screens) */}
        <div className="lg:hidden flex bg-[#FFF0F4] p-1 rounded-2xl border border-[#F7DDE4]">
          <button
            onClick={() => setActiveMobileTab('player')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeMobileTab === 'player'
                ? 'bg-white text-[#681F3B] shadow-xs'
                : 'text-[#75676E] hover:text-[#681F3B]'
            }`}
          >
            🎵 Music Player
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

        {/* MOBILE AUTOPLAY RESTRICTION BANNER */}
        {globalAutoplayBlocked && (
          <button
            onClick={() => {
              setGlobalAutoplayBlocked(false)
              toggleGlobalPlay()
            }}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#681F3B] to-[#9E3155] text-white text-xs font-bold flex items-center justify-between shadow-xl animate-pulse cursor-pointer border border-[#F7DDE4]"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🎵</span>
              <span className="text-left">
                {partnerName} is playing "{globalAudioTrack?.title}". Tap here to start audio playback on your device!
              </span>
            </div>
            <span className="bg-white text-[#681F3B] px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 shadow-sm ml-2">
              Tap to Listen ▶
            </span>
          </button>
        )}

        {/* MAIN NORMAL VIEW GRID - Always displays Player Card & Live Chat Box on all screen sizes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Main Player Card */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F7DDE4] shadow-xl relative overflow-hidden space-y-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFF0F4] rounded-full blur-3xl pointer-events-none" />

              {/* Cover Art */}
              <div className="flex justify-center relative z-10">
                <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-3xl bg-gradient-to-br from-[#FFF0F4] to-[#F7DDE4] border-4 border-white shadow-2xl flex items-center justify-center text-7xl relative group overflow-hidden">
                  <span className="group-hover:scale-110 transition-transform duration-500">{globalAudioTrack?.cover || '🎵'}</span>
                  {globalIsPlaying && (
                    <div className="absolute bottom-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>Playing Together</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Player Controls & Info */}
              <div className="space-y-5 relative z-10 text-center">
                <div>
                  <span className="text-[10px] font-bold text-[#C44569] tracking-widest uppercase">Shared Song</span>
                  <h2 className="text-2xl font-serif font-bold text-[#681F3B] mt-1">{globalAudioTrack?.title}</h2>
                  <p className="text-xs text-[#75676E] mt-0.5">{globalAudioTrack?.artist}</p>
                </div>

                {/* Time Slider */}
                <div className="space-y-2 max-w-md mx-auto">
                  <input
                    type="range"
                    min="0"
                    max={globalDuration || 100}
                    value={isNaN(sliderTime) || sliderTime === null || sliderTime === undefined ? 0 : sliderTime}
                    onMouseDown={() => setIsSeeking(true)}
                    onTouchStart={() => setIsSeeking(true)}
                    onChange={(e) => setLocalSeekTime(parseFloat(e.target.value))}
                    onMouseUp={(e) => {
                      seekGlobalTrack(parseFloat(e.target.value))
                      setTimeout(() => setIsSeeking(false), 300)
                    }}
                    onTouchEnd={(e) => {
                      seekGlobalTrack(parseFloat(e.target.value))
                      setTimeout(() => setIsSeeking(false), 300)
                    }}
                    className="w-full accent-[#C44569] cursor-pointer h-2"
                  />
                  <div className="flex justify-between text-[11px] font-semibold text-[#75676E]">
                    <span>{formatTime(sliderTime)}</span>
                    <span>{formatTime(globalDuration)}</span>
                  </div>
                </div>

                {/* Play, Skip & Full Screen Controls */}
                <div className="flex items-center justify-center gap-3 sm:gap-4 pt-1 flex-wrap">
                  <button
                    onClick={() => setIsFullscreen(true)}
                    className="px-4 py-2.5 rounded-full bg-[#681F3B] text-white hover:bg-[#9E3155] transition-all flex items-center justify-center text-xs font-bold shadow-md gap-1.5 cursor-pointer"
                    title="Enter Full Screen Mode"
                  >
                    <span>⛶</span>
                    <span>Full Screen</span>
                  </button>

                  <button
                    onClick={() => skipGlobalTrack(-10)}
                    className="px-3.5 py-2.5 rounded-full bg-[#FFF0F4] border border-[#F7DDE4] text-[#681F3B] hover:bg-[#F7DDE4] transition-all flex items-center justify-center text-xs font-bold shadow-xs gap-1 cursor-pointer"
                    title="Skip 10 seconds backward"
                  >
                    <span>↺</span>
                    <span>10s</span>
                  </button>

                  <button
                    onClick={toggleGlobalPlay}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-[#C44569] to-[#9E3155] text-white shadow-xl hover:scale-105 transition-transform flex items-center justify-center text-2xl cursor-pointer shrink-0"
                  >
                    {globalIsPlaying ? '⏸' : '▶'}
                  </button>

                  <button
                    onClick={() => skipGlobalTrack(10)}
                    className="px-3.5 py-2.5 rounded-full bg-[#FFF0F4] border border-[#F7DDE4] text-[#681F3B] hover:bg-[#F7DDE4] transition-all flex items-center justify-center text-xs font-bold shadow-xs gap-1 cursor-pointer"
                    title="Skip 10 seconds forward"
                  >
                    <span>10s</span>
                    <span>↻</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Embedded Live Chat Box (Always Visible) */}
          <div className="lg:col-span-5 h-[540px] w-full">
            <ChatPanel title="Live Shared Chat" variant="light" />
          </div>
        </div>

        {/* Playlist Queue */}
        <div className="bg-white rounded-3xl p-6 border border-[#F7DDE4] shadow-sm">
          <h3 className="text-base font-serif font-bold text-[#681F3B] mb-4">🎵 Playlist Queue</h3>
          <div className="space-y-2">
            {queue.map((track) => {
              const isSelected = track.src === globalAudioTrack?.src
              return (
                <div
                  key={track.id || track.src}
                  onClick={() => selectGlobalTrack(track)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#FFF0F4] border-[#C44569] text-[#681F3B] font-semibold shadow-xs'
                      : 'border-[#F7DDE4] hover:bg-[#FFF9F7] text-[#2B2025]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{track.cover || '🎵'}</span>
                    <div>
                      <p className="text-xs font-bold">{track.title}</p>
                      <p className="text-[10px] text-[#75676E]">{track.artist}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#75676E]">{track.duration}</span>
                    {isSelected && <span className="text-xs text-[#C44569]">▶ Active</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* FULLSCREEN OVERLAY MODE WITH RIGHT-SIDE CHAT */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#1A0C18] via-[#2A1024] to-[#120712] text-white flex flex-col md:flex-row overflow-hidden animate-fadeIn">
          {/* Main Fullscreen Player Area */}
          <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 relative overflow-y-auto">
            {/* Top Bar Controls */}
            <div className="flex items-center justify-between z-20">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-semibold text-white/80">Listening Together in Fullscreen</span>
              </div>

              <div className="flex items-center gap-3">
                {!showChatInFullscreen && (
                  <button
                    onClick={() => setShowChatInFullscreen(true)}
                    className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <span>💬 Show Chat</span>
                  </button>
                )}
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="px-4 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <span>✕ Exit Fullscreen</span>
                </button>
              </div>
            </div>

            {/* Central Artwork & Song Info */}
            <div className="my-auto flex flex-col items-center text-center space-y-6 py-6 z-10">
              <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-2xl flex items-center justify-center text-8xl relative group overflow-hidden">
                <span className="group-hover:scale-110 transition-transform duration-500">{globalAudioTrack?.cover || '🎵'}</span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </div>

              <div>
                <span className="text-xs font-bold text-[#F7DDE4] tracking-widest uppercase">Shared Song</span>
                <h2 className="text-3xl font-serif font-bold text-white mt-1">{globalAudioTrack?.title}</h2>
                <p className="text-sm text-white/70 mt-1">{globalAudioTrack?.artist}</p>
              </div>

              {/* Slider */}
              <div className="w-full max-w-md space-y-2">
                <input
                  type="range"
                  min="0"
                  max={globalDuration || 100}
                  value={isNaN(sliderTime) || sliderTime === null || sliderTime === undefined ? 0 : sliderTime}
                  onMouseDown={() => setIsSeeking(true)}
                  onTouchStart={() => setIsSeeking(true)}
                  onChange={(e) => setLocalSeekTime(parseFloat(e.target.value))}
                  onMouseUp={(e) => {
                    seekGlobalTrack(parseFloat(e.target.value))
                    setTimeout(() => setIsSeeking(false), 300)
                  }}
                  onTouchEnd={(e) => {
                    seekGlobalTrack(parseFloat(e.target.value))
                    setTimeout(() => setIsSeeking(false), 300)
                  }}
                  className="w-full accent-[#C44569] cursor-pointer h-2"
                />
                <div className="flex justify-between text-xs font-mono text-white/60">
                  <span>{formatTime(sliderTime)}</span>
                  <span>{formatTime(globalDuration)}</span>
                </div>
              </div>

              {/* Fullscreen Controls */}
              <div className="flex items-center gap-6 pt-2">
                <button
                  onClick={() => skipGlobalTrack(-10)}
                  className="w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all flex items-center justify-center text-sm font-bold shadow-md"
                  title="Skip 10 seconds backward"
                >
                  ↺ 10s
                </button>

                <button
                  onClick={toggleGlobalPlay}
                  className="w-20 h-20 rounded-full bg-gradient-to-r from-[#C44569] to-[#9E3155] text-white shadow-2xl hover:scale-105 transition-transform flex items-center justify-center text-3xl"
                >
                  {globalIsPlaying ? '⏸' : '▶'}
                </button>

                <button
                  onClick={() => skipGlobalTrack(10)}
                  className="w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all flex items-center justify-center text-sm font-bold shadow-md"
                  title="Skip 10 seconds forward"
                >
                  10s ↻
                </button>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="text-center text-xs text-white/50 z-10">
              JustUs Persistent Music Space • Audio keeps playing when you navigate anywhere
            </div>
          </div>

          {/* Right-Side Collapsible Private Chat Box */}
          {showChatInFullscreen && (
            <ChatPanel
              title="Music Chat"
              variant="dark"
              onClose={() => setShowChatInFullscreen(false)}
            />
          )}
        </div>
      )}
    </AppLayout>
  )
}
