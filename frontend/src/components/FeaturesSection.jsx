import React from 'react'
import { motion } from 'framer-motion'
import CoupleImage from './CoupleImage'

export default function FeaturesSection() {
  const features = [
    {
      folder: 'chat',
      icon: '💬',
      title: 'Chat Together',
      description: 'Private end-to-end couple chat with typing indicators, heart reactions, and high-res media sharing.',
      badge: 'Private & Real-time',
    },
    {
      folder: 'games',
      icon: '🎮',
      title: 'Play Together',
      description: 'Strengthen your connection with fun games like "How Well Do You Know Me?" and "Truth or Dare?".',
      badge: '5 Couple Games',
    },
    {
      folder: 'music',
      icon: '🎵',
      title: 'Listen Together',
      description: 'Listen to your favorite tracks at the exact same second with live partner audio synchronization.',
      badge: 'Shared Audio',
    },
    {
      folder: 'watch',
      icon: '🎬',
      title: 'Watch Together',
      description: 'Stream videos and movies in sync with shared play/pause controls and instant live reaction pills.',
      badge: 'Synced Player',
    },
    {
      folder: 'memories',
      icon: '📸',
      title: 'Save Memories',
      description: 'Build a private timeline of your relationship milestones, trip albums, and romantic dates.',
      badge: 'Timeline Album',
    },
    {
      folder: 'dates',
      icon: '🗓️',
      title: 'Plan Your Moments',
      description: 'Never miss an anniversary. Plan future dates together or generate instant romantic date night ideas.',
      badge: 'Date Planner',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  return (
    <section id="features" className="py-16 md:py-24 bg-white/70 border-y border-[#EADDE2] relative overflow-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFF1F4]/60 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-wider text-[#C44569] px-4 py-1.5 bg-[#FFF1F4] rounded-full border border-[#F7DDE4]"
          >
            All-In-One Couple Space
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#681F3B] mt-4"
          >
            Everything you love, together.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-[#75676E]"
          >
            No more switching between separate apps. JustUs brings your chat, streaming, games, and memories into one private haven.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((item, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-white rounded-3xl overflow-hidden border border-[#EADDE2] shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Feature Image Banner */}
                <div className="relative h-48 overflow-hidden bg-[#FFF9F7]">
                  <CoupleImage
                    folder={item.folder}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    aspect="16/9"
                    overlay
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="w-11 h-11 rounded-2xl bg-white/90 backdrop-blur-md border border-white/40 shadow-md flex items-center justify-center text-xl">
                      {item.icon}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 z-10">
                    <span className="text-[11px] font-bold text-[#681F3B] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#EADDE2] shadow-xs">
                      {item.badge}
                    </span>
                  </div>
                </div>

                {/* Card Text Content */}
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-[#681F3B] group-hover:text-[#C44569] transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#75676E] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex items-center justify-between text-xs font-semibold text-[#C44569]">
                <span className="group-hover:underline">Explore {item.title}</span>
                <span className="w-7 h-7 rounded-full bg-[#FFF1F4] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

