import React from 'react'

export default function GamesLandingSection() {
  const games = [
    {
      title: 'How Well Do You Know Me?',
      emoji: '🎯',
      description: 'Answer questions about your partner and test who remembers the details best!',
      color: 'bg-rose-50 border-rose-200',
    },
    {
      title: 'Would You Rather?',
      emoji: '🤔',
      description: 'Fun, romantic, and hilarious scenarios to spark deep conversations.',
      color: 'bg-pink-50 border-pink-200',
    },
    {
      title: 'This or That?',
      emoji: '⚖️',
      description: 'Quick choices! See how closely your tastes align on food, travel, and lifestyle.',
      color: 'bg-purple-50 border-purple-200',
    },
    {
      title: 'Truth or Dare?',
      emoji: '🔥',
      description: 'Spicy and sweet challenges made exclusively for two lovers.',
      color: 'bg-red-50 border-red-200',
    },
    {
      title: 'Guess My Answer?',
      emoji: '🔮',
      description: 'Predict your partner’s secret choice before the reveal!',
      color: 'bg-amber-50 border-amber-200',
    },
  ]

  return (
    <section id="games" className="py-16 md:py-24 bg-[#FFF9F7]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C44569] px-3 py-1 bg-[#F7DDE4] rounded-full">
            Couple Games Hub
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#681F3B] mt-4">
            Because relationships should be fun.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#75676E]">
            Rediscover each other with 5 interactive games crafted to spark laughter, romance, and meaningful connection.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border ${game.color} bg-white shadow-sm hover:shadow-lg transition-all card-hover flex flex-col justify-between`}
            >
              <div>
                <div className="text-4xl mb-4">{game.emoji}</div>
                <h3 className="text-xl font-serif font-bold text-[#681F3B]">
                  {game.title}
                </h3>
                <p className="mt-2 text-sm text-[#75676E] leading-relaxed">
                  {game.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#EADDE2] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#9E3155]">2 Players</span>
                <span className="text-xs font-bold text-[#C44569] hover:underline cursor-pointer">
                  Play Teaser →
                </span>
              </div>
            </div>
          ))}

          {/* Interactive Game Card Teaser */}
          <div className="p-6 rounded-2xl border border-[#C44569] bg-gradient-to-br from-[#681F3B] to-[#9E3155] text-white shadow-xl flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full text-white">
                Live Sample Question
              </span>
              <h4 className="text-lg font-serif font-bold mt-4">"What is your partner's dream romantic getaway?"</h4>
              <div className="mt-4 space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer border border-white/20">
                  🌴 Overwater Bungalow in Maldives
                </div>
                <div className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer border border-white/20">
                  🏰 Cozy Cabin in Swiss Alps
                </div>
              </div>
            </div>
            <p className="mt-4 text-[11px] text-white/80 italic">Both partners answer & score reveals instantly.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
