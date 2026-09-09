import React from 'react'
import { motion } from 'framer-motion'

export default function FloatingHeartWave() {
  const heartItems = [
    { id: 1, icon: '❤️', pos: 'left-2 sm:left-6 md:left-[275px]', size: 'text-2xl sm:text-3xl md:text-4xl', duration: 15, delay: 0 },
    { id: 2, icon: '💖', pos: 'left-6 sm:left-12 md:left-[325px]', size: 'text-xl sm:text-2xl md:text-3xl', duration: 16, delay: 3.8 },
    { id: 3, icon: '💕', pos: 'left-4 sm:left-8 md:left-[300px]', size: 'text-2xl sm:text-3xl md:text-4xl', duration: 15.5, delay: 7.5 },
    { id: 4, icon: '💗', pos: 'left-8 sm:left-16 md:left-[350px]', size: 'text-xl sm:text-2xl md:text-3xl', duration: 16.5, delay: 11.2 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {heartItems.map((h) => (
        <motion.div
          key={h.id}
          initial={{ y: '105vh', opacity: 0, scale: 0.6, x: 0 }}
          animate={{
            y: ['105vh', '75vh', '45vh', '15vh', '-10vh'],
            x: [0, 20, -10, 25, -8],
            opacity: [0, 0.65, 0.65, 0.35, 0],
            scale: [0.6, 0.95, 0.85, 1.05, 0.5],
            rotate: [0, 10, -10, 12, -6],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`absolute ${h.pos} ${h.size} drop-shadow-[0_4px_10px_rgba(196,69,105,0.3)]`}
        >
          {h.icon}
        </motion.div>
      ))}
    </div>
  )
}
