import React from 'react'

export default function AILandingSection() {
  const prompts = [
    '💡 "Give us a low-budget date idea for tonight."',
    '☔ "Suggest a cozy indoor activity for a rainy evening."',
    '🎁 "Help me plan a romantic surprise for our anniversary."',
    '🍕 "What game should we play while eating dinner?"',
  ]

  return (
    <section id="ai" className="py-16 md:py-24 bg-[#FFF9F7]">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Text */}
        <div className="lg:col-span-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C44569] px-3 py-1 bg-[#F7DDE4] rounded-full">
            AI Assistant Teaser
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#681F3B] mt-4">
            Meet your little date planner.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#75676E] leading-relaxed">
            Need fresh ideas? JustUs AI offers personalized date suggestions, game prompts, and romantic advice — completely optional and tailored to your tastes.
          </p>
          <div className="mt-6 p-4 rounded-2xl bg-white border border-[#EADDE2] text-xs text-[#75676E]">
            <p className="font-semibold text-[#681F3B] mb-1">🛡️ Privacy-First AI</p>
            <p>Your private conversations remain encrypted and are never used to train global AI models.</p>
          </div>
        </div>

        {/* Right AI Interface Preview */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADDE2] shadow-xl max-w-lg mx-auto">
            <div className="flex items-center gap-3 pb-4 border-b border-[#EADDE2]">
              <div className="w-9 h-9 rounded-full bg-[#681F3B] text-white flex items-center justify-center font-bold text-xs">
                AI
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#681F3B]">JustUs Date Assistant</h4>
                <p className="text-[11px] text-[#C44569] font-medium">Ready for prompts</p>
              </div>
            </div>

            {/* Chat preview */}
            <div className="my-6 space-y-3 text-xs sm:text-sm">
              <div className="bg-[#FFF9F7] p-3.5 rounded-2xl border border-[#EADDE2] text-[#2B2025]">
                <p className="font-semibold text-[#C44569] mb-1">User Suggestion Prompt:</p>
                <p>"Give us a romantic 3-step evening plan at home."</p>
              </div>
              <div className="bg-[#FFF1F4] p-4 rounded-2xl border border-[#F7DDE4] text-[#681F3B] space-y-2">
                <p className="font-bold text-sm">✨ Here is your custom Date Night Plan:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs text-[#2B2025]">
                  <li><strong>Cook Together:</strong> Homemade pasta & candle setup (25 mins)</li>
                  <li><strong>Play:</strong> 10 questions in "How Well Do You Know Me?"</li>
                  <li><strong>Relax:</strong> Synchronized acoustic music & stargazing</li>
                </ol>
              </div>
            </div>

            {/* Sample Pills */}
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-[#75676E] uppercase tracking-wider">Try asking:</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {prompts.map((p, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-xl bg-[#FFF9F7] border border-[#EADDE2] text-[#681F3B] hover:border-[#C44569] cursor-pointer transition-colors"
                  >
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
