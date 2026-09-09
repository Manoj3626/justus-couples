import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import CoupleImage from './CoupleImage'

export default function HeroLanding() {
  const [activeTab, setActiveTab] = useState('chat')

  const previewContent = {
    chat: {
      tag: '💬 Private Chat',
      title: 'Talk about everything',
      subtitle: 'Alex: You make my life brighter ❤️',
      bg: 'from-[#C44569] to-[#9E3155]',
      folder: 'hero',
    },
    music: {
      tag: '🎵 Audio Sync',
      title: 'Our Playlist — Better Together',
      subtitle: 'Listening in real-time sync with Sarah 🎧',
      bg: 'from-[#681F3B] to-[#C44569]',
      folder: 'music',
    },
    watch: {
      tag: '🎬 Watch Room',
      title: 'Synchronized Movie Night',
      subtitle: 'Frame-perfect stream & live reactions 🍿',
      bg: 'from-[#4A1629] to-[#681F3B]',
      folder: 'watch',
    },
    game: {
      tag: '🎮 Couple Games',
      title: 'How Well Do You Know Me?',
      subtitle: 'Test your romantic chemistry & scores 🎯',
      bg: 'from-[#9E3155] to-[#E98BA5]',
      folder: 'games',
    },
    memory: {
      tag: '📸 Timeline',
      title: 'Sunset Beach Walk saved',
      subtitle: 'Milestones saved in your private space 🌅',
      bg: 'from-[#C44569] to-[#681F3B]',
      folder: 'memories',
    },
  }

  const activeData = previewContent[activeTab]

  return (
    <section id="home" className="relative pt-6 pb-16 lg:py-20 overflow-hidden">
      {/* Floating Animated Ambient Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-10 left-10 w-72 h-72 bg-[#FFF1F4] rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 40, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 right-10 w-96 h-96 bg-[#F7DDE4] rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column Content */}
        <div className="lg:col-span-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#EADDE2] text-[#9E3155] text-xs font-semibold tracking-wide mb-6 shadow-xs">
            <span className="animate-ping w-2 h-2 rounded-full bg-[#C44569]" />
            <span>Two people. One private space.</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#681F3B] leading-[1.12] tracking-tight">
            More than an app.
            <span className="block mt-2 text-[#C44569]">
              It's your space. <span className="inline-block animate-bounce">❤️</span>
            </span>
          </h1>

          <p className="mt-6 text-lg text-[#75676E] leading-relaxed max-w-xl">
            Chat, play, listen, watch, create memories, and make every moment together feel a little more special.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap gap-4 items-center">
            <Link
              to="/signup"
              className="btn-primary px-8 py-4 text-base flex items-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              <span>Create Your Space</span>
              <span>❤️</span>
            </Link>
            <Link
              to="/login"
              className="btn-secondary px-7 py-4 text-base"
            >
              Sign In To Our Space
            </Link>
          </div>

          {/* Interactive Feature Teaser Selector */}
          <div className="mt-10 pt-6 border-t border-[#EADDE2]/80">
            <p className="text-xs font-bold uppercase tracking-wider text-[#75676E] mb-3">
              Click to preview your private space features:
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              {[
                { id: 'chat', label: '💬 Chat' },
                { id: 'music', label: '🎵 Music' },
                { id: 'watch', label: '🎬 Watch' },
                { id: 'game', label: '🎮 Games' },
                { id: 'memory', label: '📸 Memories' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl border transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#681F3B] text-white border-[#681F3B] shadow-md scale-105'
                      : 'bg-white text-[#75676E] border-[#EADDE2] hover:border-[#C44569]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column Dynamic Interactive Feature Showcase */}
        <div className="lg:col-span-6">
          <div className="relative mx-auto max-w-lg lg:max-w-none">
            {/* Main Interactive Display Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4 }}
                className="relative rounded-3xl overflow-hidden border border-[#EADDE2] shadow-2xl bg-white aspect-[4/3] group"
              >
                <CoupleImage
                  folder={activeData.folder}
                  alt={activeData.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  aspect="4/3"
                  eager
                  overlay
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#681F3B]/90 via-[#681F3B]/20 to-transparent p-6 flex flex-col justify-between text-white z-10">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
                      {activeData.tag}
                    </span>
                    <span className="text-xl">❤️</span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-serif font-bold text-white drop-shadow-md">
                      {activeData.title}
                    </h3>
                    <p className="text-xs text-white/90 mt-1 font-medium drop-shadow">
                      {activeData.subtitle}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Floating Card 1 */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-5 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-[#EADDE2] flex items-center gap-3 z-20"
            >
              <div className="w-10 h-10 rounded-full bg-[#FFF1F4] text-[#C44569] flex items-center justify-center font-bold text-lg">
                💬
              </div>
              <div>
                <p className="text-[10px] text-[#75676E] font-semibold">Sarah • Just now</p>
                <p className="text-xs font-bold text-[#2B2025]">You make my life brighter ❤️</p>
              </div>
            </motion.div>

            {/* Floating Card 2 */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-5 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-[#EADDE2] flex items-center gap-3 z-20"
            >
              <div className="w-10 h-10 rounded-full bg-[#681F3B] text-white flex items-center justify-center font-bold text-base">
                142
              </div>
              <div>
                <p className="text-[10px] text-[#75676E] uppercase font-bold tracking-wider">Together Counter</p>
                <p className="text-xs font-bold text-[#681F3B]">142 Days & Counting ❤️</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
