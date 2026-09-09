import React, { useState } from 'react'

export default function MusicLandingSection() {
  const [isPlaying, setIsPlaying] = useState(true)

  return (
    <section id="music" className="py-16 md:py-24 bg-white border-t border-[#EADDE2]">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Text */}
        <div className="lg:col-span-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C44569] px-3 py-1 bg-[#FFF1F4] rounded-full">
            Synchronized Audio
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#681F3B] mt-4">
            Listen Together. <span className="text-[#C44569]">🎵</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#75676E] leading-relaxed">
            Whether you are sitting next to each other or miles apart, listen to your shared relationship playlist in real-time sync.
          </p>

          <div className="mt-8 space-y-4 text-sm text-[#2B2025]">
            <div className="flex items-start gap-3">
              <span className="text-xl">🎧</span>
              <div>
                <h4 className="font-semibold text-[#681F3B]">Live Audio Sync</h4>
                <p className="text-xs text-[#75676E]">When one partner hits play or pauses, both devices sync instantly.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">📜</span>
              <div>
                <h4 className="font-semibold text-[#681F3B]">Shared Couple Queue</h4>
                <p className="text-xs text-[#75676E]">Add your favorite songs to a joint playlist reserved just for two.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Music Player Mockup */}
        <div className="lg:col-span-7">
          <div className="bg-gradient-to-br from-[#681F3B] to-[#4A1629] text-white p-8 rounded-3xl shadow-2xl max-w-md mx-auto relative overflow-hidden border border-[#EADDE2]">
            {/* Live Sync Badge */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Listening With Sarah
              </span>
              <span className="text-xs text-white/70">Quality Audio 320kbps</span>
            </div>

            {/* Album Cover */}
            <div className="w-full aspect-square rounded-2xl bg-gradient-to-tr from-[#C44569] to-[#E98BA5] p-6 flex flex-col justify-end shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative z-10">
                <span className="text-4xl">💕</span>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/80 mt-4">JustUs Playlist</p>
                <h3 className="text-2xl font-serif font-bold text-white">Better Together</h3>
                <p className="text-sm text-white/90">Jack Johnson</p>
              </div>
            </div>

            {/* Progress Slider */}
            <div className="mt-6">
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden cursor-pointer">
                <div className="bg-[#E98BA5] h-full w-3/5 rounded-full" />
              </div>
              <div className="flex justify-between text-[11px] text-white/70 mt-1.5 font-medium">
                <span>1:48</span>
                <span>3:27</span>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-6 flex items-center justify-center gap-6">
              <button className="text-white/70 hover:text-white text-xl">⏮</button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 rounded-full bg-[#C44569] hover:bg-[#E98BA5] text-white text-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-105"
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button className="text-white/70 hover:text-white text-xl">⏭</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
