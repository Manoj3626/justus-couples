import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function HeartBurstAnimation({ active, onComplete }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (active) {
      const hearts = Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 450,
        y: (Math.random() - 0.5) * 450,
        scale: Math.random() * 0.8 + 0.6,
        rotation: (Math.random() - 0.5) * 60,
        emoji: ['❤️', '💖', '💕', '💗', '✨', '🌹', '🥂'][Math.floor(Math.random() * 7)],
      }))
      setParticles(hearts)

      const timer = setTimeout(() => {
        setParticles([])
        if (onComplete) onComplete()
      }, 3500)
      return () => clearTimeout(timer)
    }
  }, [active, onComplete])

  if (!active && particles.length === 0) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
        {/* Ambient Overlay Pulse */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0] }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-[#C44569]/20 backdrop-blur-xs"
        />

        {/* Central Burst Pulse Ring */}
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="w-48 h-48 rounded-full border-4 border-[#C44569] bg-[#C44569]/10"
        />

        {/* Floating Heart Explosions */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
            animate={{
              x: p.x,
              y: p.y - 80,
              scale: p.scale,
              opacity: [1, 1, 0],
              rotate: p.rotation,
            }}
            transition={{ duration: 2.2, ease: 'easeOut' }}
            className="absolute text-3xl sm:text-4xl drop-shadow-lg"
          >
            {p.emoji}
          </motion.div>
        ))}

        {/* Central Celebration Text */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [0.8, 1.1, 1], opacity: [0, 1, 0] }}
          transition={{ duration: 3, times: [0, 0.3, 1] }}
          className="bg-white/95 backdrop-blur-md px-8 py-4 rounded-3xl border-2 border-[#C44569] shadow-2xl text-center z-10"
        >
          <span className="text-4xl block mb-1">🎉 ❤️ 🎉</span>
          <h3 className="text-2xl font-serif font-bold text-[#681F3B]">Partners Connected!</h3>
          <p className="text-xs text-[#C44569] font-bold mt-1">Your private space for two is now active</p>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
