import React from 'react'
import { motion } from 'framer-motion'
import CoupleImage from './CoupleImage'

export default function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      title: 'Create your account',
      description: 'Sign up in seconds with your name and password. Your personal login details are securely encrypted.',
      icon: '👤',
      folder: 'hero',
      badge: 'Quick Sign Up',
    },
    {
      step: '02',
      title: 'Create your private space',
      description: 'Set up your relationship hub with your anniversary date and custom partner nicknames.',
      icon: '🏡',
      folder: 'couples',
      badge: 'Personalized Hub',
    },
    {
      step: '03',
      title: 'Invite your partner',
      description: 'Share your secure 6-digit invitation code or direct link with your special someone.',
      icon: '💌',
      folder: 'chat',
      badge: 'Secure Link',
    },
    {
      step: '04',
      title: 'Start your moments',
      description: 'Once connected, your private space opens — chat, stream music & movies, play games, and store memories.',
      icon: '✨',
      folder: 'date-night',
      badge: 'Full Access',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const stepVariants = {
    hidden: { opacity: 0, y: 35, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-[#FFF9F7] relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#F7DDE4]/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-wider text-[#C44569] px-4 py-1.5 bg-[#F7DDE4] rounded-full border border-[#E98BA5]/30 inline-block"
          >
            Simple 4-Step Setup
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#681F3B] mt-4"
          >
            How JustUs Works
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-[#75676E]"
          >
            Getting started takes under two minutes. Here is how you build your private space for two.
          </motion.p>
        </div>

        {/* 4 Animated Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative"
        >
          {steps.map((item, idx) => (
            <motion.div
              key={idx}
              variants={stepVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-white rounded-3xl overflow-hidden border border-[#EADDE2] shadow-sm hover:shadow-xl hover:border-[#C44569] transition-all flex flex-col justify-between group relative"
            >
              <div>
                {/* Step Image Visual */}
                <div className="relative h-44 overflow-hidden bg-[#FFF1F4]">
                  <CoupleImage
                    folder={item.folder}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    aspect="16/9"
                    overlay
                  />

                  {/* Step Badge Overlay */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                    <span className="w-9 h-9 rounded-xl bg-[#681F3B] text-white flex items-center justify-center font-serif font-bold text-sm shadow-md">
                      {item.step}
                    </span>
                    <span className="text-[11px] font-bold text-white bg-[#681F3B]/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 shadow-xs">
                      {item.badge}
                    </span>
                  </div>

                  {/* Icon Badge Overlay */}
                  <div className="absolute bottom-3 right-3 z-10">
                    <span className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-[#C44569] flex items-center justify-center text-lg shadow-md border border-white/60">
                      {item.icon}
                    </span>
                  </div>
                </div>

                {/* Step Details */}
                <div className="p-6">
                  <h3 className="text-lg font-serif font-bold text-[#681F3B] group-hover:text-[#C44569] transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#75676E] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Progress Indicator Footer */}
              <div className="px-6 pb-5 pt-2 flex items-center justify-between border-t border-[#EADDE2]/50 text-xs font-semibold text-[#C44569]">
                <span>Step {idx + 1} of 4</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-sm"
                >
                  {idx === 3 ? '🎉' : '➔'}
                </motion.span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

