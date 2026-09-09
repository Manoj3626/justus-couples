import React from 'react'

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-16 md:py-24 bg-gradient-to-b from-[#FFF9F7] via-[#FFF1F4]/40 to-[#FFF9F7]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C44569] px-3 py-1 bg-[#F7DDE4] rounded-full">
            Dashboard Teaser
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#681F3B] mt-4">
            Your little world, all in one place.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#75676E]">
            Here is a sneak peek inside the private dashboard you and your partner will share every day.
          </p>
        </div>

        {/* Dashboard Frame Mockup */}
        <div className="mt-12 max-w-5xl mx-auto bg-white rounded-3xl p-4 sm:p-8 border border-[#EADDE2] shadow-2xl relative overflow-hidden">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#EADDE2]">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                <div className="w-11 h-11 rounded-full bg-[#C44569] text-white flex items-center justify-center font-bold border-2 border-white shadow">
                  A
                </div>
                <div className="w-11 h-11 rounded-full bg-[#9E3155] text-white flex items-center justify-center font-bold border-2 border-white shadow">
                  S
                </div>
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg text-[#681F3B]">Alex & Sarah</h4>
                <p className="text-xs text-[#75676E]">"Welcome back to our little world."</p>
              </div>
            </div>

            {/* Together Counter Badge */}
            <div className="px-4 py-2 rounded-2xl bg-[#FFF1F4] border border-[#F7DDE4] flex items-center gap-2">
              <span className="text-lg">❤️</span>
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-[#C44569]">Together For</p>
                <p className="text-sm font-bold text-[#681F3B]">142 Days & Counting</p>
              </div>
            </div>
          </div>

          {/* Quick Action Pills */}
          <div className="my-6 flex flex-wrap gap-2.5">
            <button className="px-4 py-2 rounded-xl bg-[#681F3B] text-white text-xs font-semibold flex items-center gap-1.5 shadow">
              💬 Chat
            </button>
            <button className="px-4 py-2 rounded-xl bg-[#FFF1F4] text-[#C44569] border border-[#F7DDE4] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#F7DDE4] transition-colors">
              🎮 Play Game
            </button>
            <button className="px-4 py-2 rounded-xl bg-[#FFF1F4] text-[#C44569] border border-[#F7DDE4] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#F7DDE4] transition-colors">
              🎵 Shared Music
            </button>
            <button className="px-4 py-2 rounded-xl bg-[#FFF1F4] text-[#C44569] border border-[#F7DDE4] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#F7DDE4] transition-colors">
              🎬 Watch Together
            </button>
            <button className="px-4 py-2 rounded-xl bg-[#FFF1F4] text-[#C44569] border border-[#F7DDE4] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#F7DDE4] transition-colors">
              📸 Memories
            </button>
            <button className="px-4 py-2 rounded-xl bg-[#FFF1F4] text-[#C44569] border border-[#F7DDE4] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#F7DDE4] transition-colors">
              🗓️ Plan Date
            </button>
          </div>

          {/* Widgets Grid Mockup */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Widget 1: Latest Message */}
            <div className="bg-[#FFF9F7] p-4 rounded-2xl border border-[#EADDE2] flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#75676E]">
                <span className="font-semibold text-[#681F3B]">💬 Latest Message</span>
                <span>2m ago</span>
              </div>
              <div className="my-3 p-3 rounded-xl bg-white border border-[#EADDE2] text-xs text-[#2B2025]">
                <p className="font-semibold text-[#C44569]">Sarah</p>
                <p className="mt-1">Can't wait for our candlelit dinner tonight! ✨</p>
              </div>
              <span className="text-[11px] text-[#C44569] font-medium">Tap to reply →</span>
            </div>

            {/* Widget 2: Currently Playing Music */}
            <div className="bg-[#FFF9F7] p-4 rounded-2xl border border-[#EADDE2] flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#75676E]">
                <span className="font-semibold text-[#681F3B]">🎵 Listening Together</span>
                <span className="text-emerald-600 font-semibold">Live Sync</span>
              </div>
              <div className="my-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C44569] text-white flex items-center justify-center font-bold text-sm">
                  🎧
                </div>
                <div>
                  <p className="text-xs font-bold text-[#2B2025]">Better Together</p>
                  <p className="text-[11px] text-[#75676E]">Jack Johnson</p>
                </div>
              </div>
              <div className="w-full bg-[#EADDE2] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#C44569] h-full w-2/3 rounded-full" />
              </div>
            </div>

            {/* Widget 3: Upcoming Date */}
            <div className="bg-[#FFF9F7] p-4 rounded-2xl border border-[#EADDE2] flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#75676E]">
                <span className="font-semibold text-[#681F3B]">🗓️ Next Date</span>
                <span className="text-[#C44569] font-semibold">Friday</span>
              </div>
              <div className="my-3">
                <p className="text-xs font-bold text-[#681F3B]">Candlelight Italian Dinner</p>
                <p className="text-[11px] text-[#75676E] mt-0.5">La Bella Pasta • 7:30 PM</p>
              </div>
              <div className="text-[11px] font-semibold text-[#681F3B] bg-[#FFF1F4] px-2.5 py-1 rounded-lg inline-block w-max">
                Countdown: 2 days left
              </div>
            </div>

            {/* Widget 4: Latest Memory */}
            <div className="bg-[#FFF9F7] p-4 rounded-2xl border border-[#EADDE2] flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#75676E]">
                <span className="font-semibold text-[#681F3B]">📸 Memory Highlight</span>
                <span>Sep 4</span>
              </div>
              <div className="my-3">
                <p className="text-xs font-bold text-[#2B2025]">Sunset Beach Walk 🌅</p>
                <p className="text-[11px] text-[#75676E] mt-0.5">"Best weekend trip ever."</p>
              </div>
              <span className="text-[11px] text-[#C44569] font-medium">View memory timeline →</span>
            </div>

            {/* Widget 5: Game Invitation */}
            <div className="bg-[#FFF9F7] p-4 rounded-2xl border border-[#EADDE2] flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#75676E]">
                <span className="font-semibold text-[#681F3B]">🎮 Game Challenge</span>
                <span className="bg-[#F7DDE4] text-[#9E3155] px-2 py-0.5 rounded text-[10px] font-bold">New</span>
              </div>
              <div className="my-3">
                <p className="text-xs font-bold text-[#2B2025]">How Well Do You Know Me?</p>
                <p className="text-[11px] text-[#75676E] mt-0.5">Sarah sent you 5 questions!</p>
              </div>
              <button className="w-full py-1.5 rounded-lg bg-[#C44569] text-white text-xs font-semibold hover:bg-[#9E3155] transition-colors">
                Play Now
              </button>
            </div>

            {/* Widget 6: Watch Together Teaser */}
            <div className="bg-[#FFF9F7] p-4 rounded-2xl border border-[#EADDE2] flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#75676E]">
                <span className="font-semibold text-[#681F3B]">🎬 Watch Together</span>
                <span>Tonight</span>
              </div>
              <div className="my-3">
                <p className="text-xs font-bold text-[#2B2025]">Romantic Comedy Night</p>
                <p className="text-[11px] text-[#75676E] mt-0.5">Partner status: Ready 🍿</p>
              </div>
              <span className="text-[11px] text-[#C44569] font-medium">Join watch room →</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
