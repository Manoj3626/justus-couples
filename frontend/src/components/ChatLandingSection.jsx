import React from 'react'
import CoupleImage from './CoupleImage'

export default function ChatLandingSection() {
  return (
    <section id="chat" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Column Text */}
        <div className="lg:col-span-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C44569] px-3 py-1 bg-[#FFF1F4] rounded-full">
            Private Chat Made For Two
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#681F3B] mt-4">
            Talk about everything. <span className="text-[#C44569]">❤️</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#75676E] leading-relaxed">
            No group distractions. No ads. Just a peaceful, private chat thread designed strictly for you and your partner.
          </p>

          <ul className="mt-8 space-y-4 text-sm font-medium text-[#2B2025]">
            <li className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#FFF1F4] text-[#C44569] flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              End-to-end private conversation with message timestamps
            </li>
            <li className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#FFF1F4] text-[#C44569] flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              Live typing indicators & online partner status
            </li>
            <li className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#FFF1F4] text-[#C44569] flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              Instant photo sharing & emoji reactions
            </li>
          </ul>
        </div>

        {/* Right Column Chat Mockup */}
        <div className="lg:col-span-7">
          <div className="bg-[#FFF9F7] rounded-3xl p-6 sm:p-8 border border-[#EADDE2] shadow-xl max-w-lg mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EADDE2]">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#C44569] text-white flex items-center justify-center font-bold">
                    S
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#681F3B]">Sarah ❤️</h4>
                  <p className="text-[11px] text-emerald-600 font-semibold">Active now</p>
                </div>
              </div>
              <span className="text-xs text-[#75676E] bg-white px-3 py-1 rounded-full border border-[#EADDE2]">
                Couple Chat
              </span>
            </div>

            {/* Messages Flow */}
            <div className="py-6 space-y-4 text-xs sm:text-sm">
              {/* Partner A Message (Left) */}
              <div className="flex gap-2.5 max-w-[85%]">
                <div className="w-7 h-7 rounded-full bg-[#C44569] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  S
                </div>
                <div>
                  <div className="bg-[#F7DDE4] text-[#2B2025] p-3.5 rounded-2xl rounded-tl-none border border-[#EADDE2]/60 shadow-sm">
                    How was your work today my love? ❤️
                  </div>
                  <span className="text-[10px] text-[#75676E] mt-1 block">5:14 PM</span>
                </div>
              </div>

              {/* Partner B Message (Right) */}
              <div className="flex justify-end">
                <div className="max-w-[85%]">
                  <div className="bg-[#C44569] text-white p-3.5 rounded-2xl rounded-tr-none shadow-md">
                    Much better now that I am talking to you! Look at what I saved for our trip 🌴
                  </div>
                  <div className="mt-1 flex justify-end items-center gap-1">
                    <span className="text-[10px] text-[#75676E]">5:16 PM</span>
                    <span className="text-[#C44569] text-xs">✓✓</span>
                  </div>
                </div>
              </div>

              {/* Shared Image Bubble */}
              <div className="flex justify-end">
                <div className="max-w-[70%] bg-white p-2 rounded-2xl border border-[#EADDE2] shadow-sm">
                  <CoupleImage
                    folder="chat"
                    alt="Couple sharing a beautiful moment"
                    className="w-full h-36 rounded-xl object-cover"
                    aspect="16/9"
                  />
                  <div className="mt-2 text-center text-xs font-semibold text-[#681F3B]">
                    Our beach spot reserved! 🌊
                  </div>
                </div>
              </div>

              {/* Partner A Typing indicator */}
              <div className="flex gap-2 items-center text-xs text-[#75676E] pt-2">
                <span className="w-2 h-2 bg-[#C44569] rounded-full animate-ping" />
                <span>Sarah is typing…</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
