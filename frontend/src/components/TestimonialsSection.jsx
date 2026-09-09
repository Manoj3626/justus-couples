import React from 'react'

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Finally, one private place that feels genuinely like ours. We love having our playlist, game nights, and memories together.",
      couple: "Alex & Sam",
      tag: "Together for 2 years",
    },
    {
      quote: "Movie nights and synchronized audio became our favorite ritual during long distance. It makes us feel close even when apart.",
      couple: "Maya & Arjun",
      tag: "Together for 3 years",
    },
    {
      quote: "The Date Night generator saved so many weekend decisions! Plus saving our milestone timeline in one cozy app is wonderful.",
      couple: "Riya & Karan",
      tag: "Together for 1 year",
    },
  ]

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-white border-t border-[#EADDE2]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C44569] px-3 py-1 bg-[#FFF1F4] rounded-full">
            Demo Couple Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#681F3B] mt-4">
            Loved by couples.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#75676E]">
            Here is what couples love about spending time in their private JustUs space.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#FFF9F7] rounded-2xl p-8 border border-[#EADDE2] shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="text-[#C44569] text-2xl mb-4">“</div>
                <p className="text-sm text-[#2B2025] leading-relaxed italic">
                  {item.quote}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#EADDE2] flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-[#681F3B] text-base">{item.couple}</h4>
                  <p className="text-[11px] text-[#75676E]">{item.tag}</p>
                </div>
                <span className="text-lg">❤️</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
