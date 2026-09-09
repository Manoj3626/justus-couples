import React, { useState } from 'react'

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[#EADDE2] last:border-0 py-5 px-6 transition-colors hover:bg-[#FFF9F7]">
      <button
        className="w-full flex justify-between items-center text-left gap-4"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="font-serif font-semibold text-base sm:text-lg text-[#681F3B]">
          {q}
        </span>
        <span className="w-8 h-8 rounded-full bg-[#FFF1F4] text-[#C44569] flex items-center justify-center font-bold text-sm shrink-0">
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <div className="mt-3 text-sm text-[#75676E] leading-relaxed pr-8 animate-fadeIn">
          {a}
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  const faqs = [
    {
      q: 'What is JustUs?',
      a: 'JustUs is a private space exclusively for two people to chat, stream music & videos together, play romantic games, and store special memories.',
    },
    {
      q: 'How do I connect with my partner?',
      a: 'After creating your account, generate your private 6-digit connection code or link. Share it with your partner, and your private space opens instantly when they enter it.',
    },
    {
      q: 'How do Music and Video streaming work?',
      a: 'When you play or pause a song or video, it syncs instantly on both of your devices so you can watch and listen together in real time.',
    },
    {
      q: 'Is our space safe and private?',
      a: 'Yes, absolutely. Your space is strictly locked to only the two of you. We never sell your data or display advertisements.',
    },
    {
      q: 'Is JustUs free to use?',
      a: 'Yes! You can create your space and enjoy all core features for free right away.',
    },
  ]

  return (
    <section id="faq" className="py-16 md:py-24 bg-[#FFF9F7]">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C44569] px-3.5 py-1 bg-[#F7DDE4] rounded-full border border-[#E98BA5]/30">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#681F3B] mt-4">
            Common Questions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#75676E]">
            Quick answers to help you get started with your private space.
          </p>
        </div>

        <div className="mt-12 bg-white rounded-3xl border border-[#EADDE2] shadow-md overflow-hidden">
          {faqs.map((item, idx) => (
            <FAQItem key={idx} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  )
}

