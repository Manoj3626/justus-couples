import React from 'react'

export default function WhyJustUsSection() {
  return (
    <section id="why-justus" className="py-16 md:py-24 bg-[#FFF9F7]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C44569] px-3 py-1 bg-[#F7DDE4] rounded-full">
            The JustUs Difference
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#681F3B] mt-4">
            Why couples switch to JustUs.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#75676E]">
            Stop scattering your relationship across generic social networks and chat apps.
          </p>
        </div>

        {/* Side-by-side comparison */}
        <div className="mt-14 max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Traditional Scattered Apps */}
          <div className="bg-white rounded-3xl p-8 border border-[#EADDE2] shadow-sm">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-100 px-3 py-1 rounded-full mb-6">
              ❌ Traditional Apps
            </div>
            <ul className="space-y-4 text-sm text-[#75676E]">
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold">✕</span>
                <span>Chat in messaging app cluttered with work groups</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold">✕</span>
                <span>Music shared on separate music streaming apps</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold">✕</span>
                <span>Photos lost deep inside phone camera rolls</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold">✕</span>
                <span>Dates noted in work calendar or forgotten text messages</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold">✕</span>
                <span>Interrupted by ads and public feeds</span>
              </li>
            </ul>
          </div>

          {/* JustUs Unified Couple Space */}
          <div className="bg-gradient-to-br from-[#681F3B] to-[#9E3155] text-white rounded-3xl p-8 shadow-xl border border-[#C44569] relative overflow-hidden">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full mb-6">
              ✨ JustUs Private Space
            </div>
            <ul className="space-y-4 text-sm text-white/95">
              <li className="flex items-start gap-3">
                <span className="text-[#E98BA5] font-bold">✓</span>
                <span>Dedicated private chat exclusively for the two of you</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#E98BA5] font-bold">✓</span>
                <span>Live synchronized music & movie watching rooms</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#E98BA5] font-bold">✓</span>
                <span>Beautiful relationship timeline for your memories</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#E98BA5] font-bold">✓</span>
                <span>Couple games hub & instant Date Night sequence generator</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#E98BA5] font-bold">✓</span>
                <span>100% private. Zero ads. "Our own little world."</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
