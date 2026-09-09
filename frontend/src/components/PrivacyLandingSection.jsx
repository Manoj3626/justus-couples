import React from 'react'

export default function PrivacyLandingSection() {
  const privacyPillars = [
    {
      icon: '🔒',
      title: 'Just For The Two Of You',
      description: 'Your space is completely private. No one else can see your messages, photos, or memories.',
    },
    {
      icon: '🛡️',
      title: 'Protected & Secure',
      description: 'Built with industry-leading encryption so your personal moments stay safe and confidential.',
    },
    {
      icon: '🚫',
      title: 'Zero Ads & Data Sales',
      description: 'We never sell your personal data or display targeted ads. Your privacy comes first.',
    },
    {
      icon: '🗑️',
      title: 'Full Control Always',
      description: 'You own your data. Easily delete photos, messages, or your account anytime you wish.',
    },
  ]

  return (
    <section id="privacy" className="py-16 md:py-24 bg-white border-t border-[#EADDE2]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C44569] px-3.5 py-1 bg-[#FFF1F4] rounded-full border border-[#F7DDE4]">
            Simple & Secure
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#681F3B] mt-4">
            Your space. Your memories. Completely private.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#75676E]">
            We believe your relationship belongs to only two people. Here is how we keep your space safe.
          </p>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {privacyPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-[#FFF9F7] rounded-2xl p-6 border border-[#EADDE2] shadow-sm hover:border-[#C44569] hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FFF1F4] border border-[#F7DDE4] flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {pillar.icon}
                </div>
                <h3 className="text-lg font-serif font-bold text-[#681F3B]">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm text-[#75676E] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#EADDE2]/60 text-[11px] font-semibold text-[#C44569] flex items-center gap-1">
                <span>✓ Verified Protection</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

