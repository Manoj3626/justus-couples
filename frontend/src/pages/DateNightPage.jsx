import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import CoupleImage from '../components/CoupleImage'

export default function DateNightPage() {
  const [selectedMood, setSelectedMood] = useState('Romantic')
  const [currentStepIdx, setCurrentStepIdx] = useState(0)
  const [started, setStarted] = useState(false)
  const navigate = useNavigate()

  const moods = [
    {
      id: 'Romantic',
      label: '❤️ Romantic',
      folder: 'date-night',
      sequence: [
        { name: 'Dinner Candle Setup 🍷', details: 'Light scented candles, dim the lights, and share a quiet home cooked dinner.' },
        { name: 'Deep Questions Game 🎯', details: 'Play "How Well Do You Know Me?" in the Games tab and learn something new.' },
        { name: 'Shared Slow Dance 🎵', details: 'Put on "Better Together" in the Music tab and enjoy a slow dance.' },
        { name: 'Romantic Movie Room 🎬', details: 'Start your synchronized watch room for a classic romance film.' },
        { name: 'Save Date Memory 📸', details: 'Take a selfie together and log tonight into your Memories Timeline.' },
      ],
    },
    {
      id: 'Fun',
      label: '🎮 Fun',
      folder: 'games',
      sequence: [
        { name: 'Takeaway Feast 🍕', details: 'Order your favorite comfort food with no dishes to wash!' },
        { name: 'Would You Rather Game 🎮', details: 'Challenge each other to 10 hilarious scenarios.' },
        { name: 'Upbeat Music Queue 🎧', details: 'Queue your favorite high-energy tracks.' },
        { name: 'Comedy Stream Night 🎬', details: 'Watch a hilarious standup or comedy in sync.' },
        { name: 'Late Night Dessert 🍨', details: 'Finish with ice cream or sweet treats.' },
      ],
    },
    {
      id: 'Playful',
      label: '😄 Playful',
      folder: 'couples',
      sequence: [
        { name: 'Cook Off Challenge 🍳', details: 'Cook a 15-minute dish using secret ingredients!' },
        { name: 'Truth or Dare Challenge 🔥', details: 'Play 5 spicy and sweet dares.' },
        { name: 'Duet Karaoke Session 🎙️', details: 'Sing your favorite duet song out loud.' },
        { name: 'Board Game Battle 🎲', details: 'Play a quick game challenge.' },
        { name: 'Photo Booth Fun 📸', details: 'Take silly romantic photos together.' },
      ],
    },
  ]

  const activeMoodObj = moods.find((m) => m.id === selectedMood) || moods[0]

  const handleNextStep = () => {
    if (currentStepIdx + 1 < activeMoodObj.sequence.length) {
      setCurrentStepIdx((s) => s + 1)
    } else {
      alert('🎉 Date Night Complete! Saving this date into your Memories Timeline!')
      navigate('/memories')
    }
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-[#C44569] uppercase tracking-wider bg-[#FFF1F4] px-3 py-1 rounded-full">
            Instant Activity Generator
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#681F3B] mt-3">
            Date Night Assistant 🍷
          </h1>
          <p className="text-sm text-[#75676E] mt-1">
            Pick your mood for tonight and let JustUs guide you through a step-by-step romantic evening.
          </p>
        </div>

        {/* Mood Chips */}
        <div className="flex flex-wrap justify-center gap-3">
          {moods.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setSelectedMood(m.id)
                setCurrentStepIdx(0)
                setStarted(false)
              }}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                selectedMood === m.id
                  ? 'bg-[#681F3B] text-white shadow-md'
                  : 'bg-white text-[#681F3B] border border-[#EADDE2] hover:border-[#C44569]'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {!started ? (
          /* Sequence Overview Card */
          <div className="bg-white rounded-3xl p-8 border border-[#EADDE2] shadow-xl text-center space-y-6">
            <CoupleImage folder={activeMoodObj.folder} alt={selectedMood} className="w-full h-48 rounded-2xl object-cover shadow-sm" aspect="16/9" />

            <span className="text-xs font-bold text-[#C44569] uppercase tracking-wider block">
              {selectedMood} Sequence Preview ({activeMoodObj.sequence.length} Steps)
            </span>

            <div className="grid sm:grid-cols-5 gap-3">
              {activeMoodObj.sequence.map((step, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-[#FFF9F7] border border-[#EADDE2] text-xs font-bold text-[#681F3B]">
                  <span className="text-[10px] text-[#C44569] block">Step {idx + 1}</span>
                  {step.name}
                </div>
              ))}
            </div>

            <button
              onClick={() => setStarted(true)}
              className="btn-primary px-8 py-3.5 text-base font-bold flex items-center justify-center gap-2 mx-auto"
            >
              <span>Start {selectedMood} Date Night</span>
              <span>❤️</span>
            </button>
          </div>
        ) : (
          /* Active Step Runner */
          <div className="bg-gradient-to-br from-white via-[#FFF9F7] to-[#FFF1F4] rounded-3xl p-8 border border-[#EADDE2] shadow-2xl space-y-6 text-center animate-fadeIn">
            <CoupleImage folder={activeMoodObj.folder} alt={selectedMood} className="w-full h-40 rounded-2xl object-cover shadow-sm" aspect="16/9" />

            <div className="flex items-center justify-between text-xs font-bold text-[#C44569]">
              <span>Step {currentStepIdx + 1} of {activeMoodObj.sequence.length}</span>
              <span>{selectedMood} Date Night</span>
            </div>

            <div className="w-full bg-[#EADDE2] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#C44569] h-full transition-all duration-300"
                style={{ width: `${((currentStepIdx + 1) / activeMoodObj.sequence.length) * 100}%` }}
              />
            </div>

            <div className="py-2">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#681F3B]">
                {activeMoodObj.sequence[currentStepIdx].name}
              </h2>
              <p className="mt-3 text-sm text-[#75676E] max-w-md mx-auto leading-relaxed font-medium">
                {activeMoodObj.sequence[currentStepIdx].details}
              </p>
            </div>

            <div className="flex justify-center gap-4 pt-4 border-t border-[#EADDE2]">
              <button
                onClick={handleNextStep}
                className="btn-primary px-8 py-3 text-sm font-bold flex items-center gap-2"
              >
                <span>Complete Step & Continue</span>
                <span>✓</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
