import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function DateNightLandingSection() {
  const [selectedMood, setSelectedMood] = useState('Romantic')

  const moods = [
    { id: 'Romantic', label: '❤️ Romantic', sequence: ['Candlelight Dinner', 'Deep Questions Game', 'Romantic Playlist', 'Slow Dance', 'Save Memory'] },
    { id: 'Fun', label: '🎮 Fun', sequence: ['Pizza & Soda', 'Would You Rather Game', 'Upbeat Music', 'Comedy Movie', 'Photo Booth'] },
    { id: 'Playful', label: '😄 Playful', sequence: ['Home Cooking Challenge', 'Truth or Dare', 'Karaoke Duet', 'Board Game', 'Ice Cream Dessert'] },
    { id: 'Movie', label: '🎬 Movie Night', sequence: ['Popcorn & Snacks', 'Pick Movie Together', 'Watch in Sync', 'Post-movie Chat', 'Late Night Snack'] },
    { id: 'Music', label: '🎧 Musical', sequence: ['Acoustic Sunset', 'Shared Queue', 'Guess That Song', 'Stargazing', 'Favorite Track Sync'] },
  ]

  const activeMoodObj = moods.find((m) => m.id === selectedMood) || moods[0]

  return (
    <section id="date-night" className="py-16 md:py-24 bg-white border-t border-[#EADDE2]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C44569] px-3 py-1 bg-[#FFF1F4] rounded-full">
            Instant Date Generator
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#681F3B] mt-4">
            Don't know what to do tonight?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#75676E]">
            Pick your mood for tonight and let JustUs build an instant date night sequence step-by-step for you both.
          </p>
        </div>

        {/* Mood Selector Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {moods.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMood(m.id)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                selectedMood === m.id
                  ? 'bg-[#681F3B] text-white shadow-md scale-105'
                  : 'bg-[#FFF9F7] text-[#681F3B] border border-[#EADDE2] hover:border-[#C44569]'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Activity Sequence Preview Container */}
        <div className="mt-12 max-w-4xl mx-auto bg-[#FFF9F7] rounded-3xl p-6 sm:p-10 border border-[#EADDE2] shadow-xl text-center">
          <p className="text-xs uppercase font-bold text-[#C44569] tracking-wider">
            {selectedMood} Date Night Sequence:
          </p>

          <div className="mt-8 grid sm:grid-cols-5 gap-3 relative">
            {activeMoodObj.sequence.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#EADDE2] shadow-sm flex items-center justify-center text-base font-bold text-[#681F3B] mb-3">
                  0{idx + 1}
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#EADDE2] text-xs font-semibold text-[#2B2025] w-full min-h-[50px] flex items-center justify-center shadow-xs">
                  {step}
                </div>
                {idx < activeMoodObj.sequence.length - 1 && (
                  <span className="hidden sm:block absolute text-[#C44569] font-bold text-lg -right-2 top-4 pointer-events-none">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center gap-4">
            <Link to="/signup" className="btn-primary px-8 py-3 text-base flex items-center gap-2">
              <span>Start Date Night</span>
              <span>❤️</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
