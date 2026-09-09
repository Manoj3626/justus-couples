import React, { useState } from 'react'

export default function WatchLandingSection() {
  const [reaction, setReaction] = useState(null)

  const sendReaction = (emoji) => {
    setReaction(emoji)
    setTimeout(() => setReaction(null), 2500)
  }

  return (
    <section id="watch" className="py-16 md:py-24 bg-[#FFF9F7]">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Column Mockup */}
        <div className="lg:col-span-7 order-2 lg:order-1">
          <div className="bg-black rounded-3xl p-4 shadow-2xl border border-[#EADDE2] relative overflow-hidden max-w-xl mx-auto">
            {/* Screen */}
            <div className="relative aspect-video rounded-2xl bg-gradient-to-tr from-slate-900 via-rose-950 to-slate-900 flex flex-col justify-between p-6 overflow-hidden border border-white/10">
              {/* Top Controls Bar */}
              <div className="flex items-center justify-between z-10">
                <span className="text-xs font-semibold text-white/80 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  🎬 Movie Room • Synchronized
                </span>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Sarah in room</span>
                </div>
              </div>

              {/* Floating Reaction Bubble */}
              {reaction && (
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none animate-bounce text-6xl">
                  {reaction}
                </div>
              )}

              {/* Center Play Indicator */}
              <div className="text-center my-auto z-10">
                <div className="w-16 h-16 rounded-full bg-[#C44569]/80 text-white text-2xl flex items-center justify-center mx-auto shadow-2xl backdrop-blur-md border border-white/20 hover:scale-110 transition-transform cursor-pointer">
                  ▶
                </div>
                <p className="text-xs font-semibold text-white/90 mt-3 drop-shadow">
                  Click to Sync Play Movie
                </p>
              </div>

              {/* Bottom Video Progress Bar */}
              <div className="z-10">
                <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#C44569] h-full w-2/5 rounded-full" />
                </div>
                <div className="flex justify-between items-center text-[11px] text-white/70 mt-2 font-medium">
                  <span>34:12 / 1:45:00</span>
                  <div className="flex items-center gap-1.5">
                    <span>Partner seek sync ON</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reaction Toolbar */}
            <div className="mt-4 flex items-center justify-between px-2">
              <p className="text-xs text-white/70 font-medium">Send Live Reaction:</p>
              <div className="flex gap-2">
                {['💖', '😍', '😂', '😮', '🍿', '🔥'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => sendReaction(emoji)}
                    className="text-lg p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-transform hover:scale-125"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Text */}
        <div className="lg:col-span-5 order-1 lg:order-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C44569] px-3 py-1 bg-[#F7DDE4] rounded-full">
            Synchronized Movie Night
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#681F3B] mt-4">
            Watch Movies Together. <span className="text-[#C44569]">🎬</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#75676E] leading-relaxed">
            Turn any evening into a virtual theater. Watch video files or streams with synchronized playback so you laugh and gasp at the exact same frame.
          </p>

          <div className="mt-8 space-y-3 text-sm text-[#2B2025]">
            <p className="flex items-center gap-2">
              <span className="text-[#C44569]">✓</span> Synchronized Play, Pause, and Seek
            </p>
            <p className="flex items-center gap-2">
              <span className="text-[#C44569]">✓</span> Live partner video & reaction overlay
            </p>
            <p className="flex items-center gap-2">
              <span className="text-[#C44569]">✓</span> Side-by-side chat while watching
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
