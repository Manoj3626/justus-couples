import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function MiniMusicPlayer() {
  const location = useLocation()
  const {
    sharedMusicState,
    globalAudioTrack,
    globalIsPlaying,
    globalCurrentTime,
    globalDuration,
    toggleGlobalPlay,
    seekGlobalTrack,
  } = useAuth()

  // Hide mini player if user is already on the Music page or if no track is active
  if (location.pathname === '/music' || !globalAudioTrack) {
    return null
  }

  const formatTime = (sec) => {
    if (isNaN(sec) || sec === null || sec === undefined) return '0:00'
    const mins = Math.floor(sec / 60)
    const secs = Math.floor(sec % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-fadeIn transition-all">
      <div className="bg-white/95 backdrop-blur-md border border-[#F7DDE4] rounded-2xl shadow-2xl p-3.5 w-72 sm:w-80 flex flex-col gap-2.5 relative overflow-hidden group">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFF0F4] rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between gap-3 relative z-10">
          <Link to="/music" className="flex items-center gap-3 min-w-0 hover:opacity-80 transition-opacity">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FFF0F4] to-[#F7DDE4] border border-[#EADDE2] flex items-center justify-center text-xl shrink-0 shadow-xs relative">
              <span>{globalAudioTrack.cover || '🎵'}</span>
              {globalIsPlaying && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-ping" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#681F3B] truncate">{globalAudioTrack.title}</p>
              <p className="text-[10px] text-[#75676E] truncate">{globalAudioTrack.artist || 'Shared Track'}</p>
            </div>
          </Link>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleGlobalPlay}
              className="w-9 h-9 rounded-full bg-gradient-to-r from-[#C44569] to-[#9E3155] text-white flex items-center justify-center text-sm shadow-md hover:scale-105 transition-transform"
              title={globalIsPlaying ? 'Pause' : 'Play'}
            >
              {globalIsPlaying ? '⏸' : '▶'}
            </button>
            <Link
              to="/music"
              className="p-2 rounded-xl text-[#75676E] hover:text-[#681F3B] hover:bg-[#FFF0F4] transition-colors text-xs font-bold"
              title="Open Shared Music Player"
            >
              ↗
            </Link>
          </div>
        </div>

        {/* Progress Slider */}
        <div className="space-y-1 relative z-10 pt-1 border-t border-[#F7DDE4]">
          <input
            type="range"
            min="0"
            max={globalDuration || 100}
            value={globalCurrentTime}
            onChange={(e) => seekGlobalTrack(parseFloat(e.target.value))}
            className="w-full accent-[#C44569] cursor-pointer h-1.5"
          />
          <div className="flex justify-between text-[9px] font-mono text-[#75676E]">
            <span>{formatTime(globalCurrentTime)}</span>
            <span>{formatTime(globalDuration)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
