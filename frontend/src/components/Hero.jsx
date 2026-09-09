import React from 'react'
import { motion } from 'framer-motion'

export default function Hero(){
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="hero-figure rounded-2xl overflow-hidden relative"
    >
      <div className="hero-image" />

      {/* Logo + tagline */}
      <div className="absolute top-6 left-6 text-white z-20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-lg font-bold">JU</div>
          <div>
            <div className="text-sm font-semibold">JustUs</div>
            <div className="text-xs opacity-90">Two people. One private space.</div>
          </div>
        </div>
      </div>

      {/* Left bottom headline */}
      <div className="absolute left-8 bottom-8 text-white z-20 max-w-sm">
        <h2 className="text-4xl font-serif leading-tight">More than an app, <span className="italic">it's our space.</span></h2>
        <p className="mt-4 text-sm opacity-90">Chat, play, listen, watch and create memories together.</p>
        <div className="mt-6 flex gap-6 text-sm opacity-90">
          <div className="flex items-center gap-2"><span className="rounded-full w-8 h-8 bg-white/10 flex items-center justify-center">💬</span>Chat</div>
          <div className="flex items-center gap-2"><span className="rounded-full w-8 h-8 bg-white/10 flex items-center justify-center">🎵</span>Music</div>
          <div className="flex items-center gap-2"><span className="rounded-full w-8 h-8 bg-white/10 flex items-center justify-center">🎬</span>Movies</div>
        </div>
      </div>

      {/* Floating UI elements */}
      <motion.div className="floating-card chat" initial={{ y: 18, opacity: 0 }} animate={{ y: -4, opacity: 1 }} transition={{ delay: 0.35 }}>
        <div className="thumb" />
        <div className="ml-3 text-sm">You make my life so much brighter</div>
      </motion.div>

      <motion.div className="floating-card music" initial={{ y: 18, opacity: 0 }} animate={{ y: -2, opacity: 1 }} transition={{ delay: 0.5 }}>
        <div className="thumb" />
        <div className="ml-3 text-sm">Our Playlist — Better Together</div>
      </motion.div>

      <motion.div className="floating-card movie" initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.65 }}>
        <div className="thumb" />
        <div className="ml-3 text-sm">Watch Together</div>
      </motion.div>

      <motion.div className="floating-card memory" initial={{ y: 18, opacity: 0 }} animate={{ y: 2, opacity: 1 }} transition={{ delay: 0.8 }}>
        <div className="thumb" />
        <div className="ml-3 text-sm">Memories</div>
      </motion.div>

      {/* Decorative curve */}
      <svg className="absolute -bottom-6 right-8 w-56 opacity-60 z-10" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,80 C40,20 160,20 200,80" stroke="#F6D1DA" strokeWidth="6" fill="none" strokeLinecap="round"/>
      </svg>

    </motion.div>
  )
}
