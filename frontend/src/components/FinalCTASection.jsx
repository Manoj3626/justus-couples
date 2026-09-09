import React from 'react'
import { Link } from 'react-router-dom'

export default function FinalCTASection() {
  return (
    <section id="cta" className="py-20 md:py-28 bg-gradient-to-br from-[#681F3B] via-[#8D2D4F] to-[#9E3155] text-white relative overflow-hidden">
      {/* Decorative ambient background blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C44569]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <span className="text-xs font-bold uppercase tracking-widest text-white/80 bg-white/15 px-4 py-1.5 rounded-full backdrop-blur-md">
          Two People. One Private Space.
        </span>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white mt-6 leading-tight">
          Create your little world.
        </h2>

        <p className="mt-4 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto font-light">
          Your conversations. Your memories. Your moments. All in one place crafted exclusively for you two.
        </p>

        <div className="mt-10 flex flex-wrap justify-center items-center gap-4">
          <Link
            to="/signup"
            className="px-8 py-4 rounded-full bg-white text-[#681F3B] font-bold text-base shadow-2xl hover:bg-[#FFF1F4] transition-all hover:scale-105"
          >
            Create Your Space ❤️
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 rounded-full border-2 border-white/40 text-white font-semibold text-base hover:bg-white/10 transition-colors"
          >
            Already have an account? Sign In
          </Link>
        </div>

        <p className="mt-6 text-xs text-white/70">
          No credit card required. Private setup in 2 minutes.
        </p>
      </div>
    </section>
  )
}
