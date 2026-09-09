import React from 'react'
import CoupleImage from './CoupleImage'

export default function MemoriesLandingSection() {
  const memories = [
    {
      title: 'Our Very First Date ❤️',
      date: 'March 14, 2024',
      category: 'First Date',
      description: 'Met at the cozy corner cafe. We talked for 4 hours straight until closing time!',
      folder: 'dates',
    },
    {
      title: 'Summer Beach Weekend 🌴',
      date: 'July 22, 2024',
      category: 'Travel',
      description: 'Watched the sunset together on the coast. Unforgettable sea breeze & endless talks.',
      folder: 'memories',
    },
    {
      title: 'Cozy Movie Night 🎬',
      date: 'October 10, 2024',
      category: 'Movie Night',
      description: 'Popcorn, warm blankets, and our favorite classic romance film.',
      folder: 'watch',
    },
    {
      title: 'Surprise Birthday Celebration 🎂',
      date: 'December 18, 2024',
      category: 'Celebration',
      description: 'Organized a quiet romantic rooftop dinner with fairy lights and cake.',
      folder: 'couples',
    },
  ]

  return (
    <section id="memories" className="py-16 md:py-24 bg-white border-t border-[#EADDE2]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C44569] px-3 py-1 bg-[#FFF1F4] rounded-full">
            Relationship Timeline
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#681F3B] mt-4">
            Your story deserves a place.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#75676E]">
            Save the little moments that become your big memories. Document your first date, trips, celebrations, and daily romantic milestones.
          </p>
        </div>

        {/* Timeline Cards Grid */}
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {memories.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#FFF9F7] rounded-2xl p-4 border border-[#EADDE2] shadow-sm hover:shadow-lg transition-all card-hover flex flex-col justify-between"
            >
              <div>
                <CoupleImage
                  folder={item.folder}
                  alt={item.title}
                  className="w-full h-44 rounded-xl object-cover mb-4 shadow-sm"
                  aspect="4/3"
                />
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-[#C44569] bg-[#FFF1F4] px-2.5 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  <span className="text-[#75676E]">{item.date}</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-[#681F3B]">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs text-[#75676E] leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#EADDE2] flex items-center justify-between text-xs text-[#C44569] font-semibold">
                <span>View Memory</span>
                <span>❤️</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
