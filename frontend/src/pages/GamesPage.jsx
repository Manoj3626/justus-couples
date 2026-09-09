import React, { useState } from 'react'
import AppLayout from '../components/AppLayout'
import CoupleImage from '../components/CoupleImage'
import { useAuth } from '../contexts/AuthContext'

export default function GamesPage() {
  const { spaceConnection } = useAuth()
  const partnerName = spaceConnection?.partnerName || 'Your partner'
  const [activeGame, setActiveGame] = useState(null)
  const [questionIdx, setQuestionIdx] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [score, setScore] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const gamesList = [
    {
      id: 'know-me',
      title: 'How Well Do You Know Me?',
      emoji: '🎯',
      folder: 'games',
      questions: [
        { q: 'What is your partner’s favorite weekend breakfast?', options: ['Pancakes & Coffee', 'Avocado Toast & Tea', 'Full English Breakfast', 'Fresh Fruit Smoothie'], correct: 0 },
        { q: 'What would your partner choose for a surprise date?', options: ['Candlelight Dinner', 'Amusement Park', 'Sunset Beach Picnic', 'Museum & Art Gallery'], correct: 2 },
      ],
    },
    {
      id: 'would-rather',
      title: 'Would You Rather?',
      emoji: '🤔',
      folder: 'couples',
      questions: [
        { q: 'Would you rather...', options: ['Live in a cozy mountain cabin', 'Live in a beachfront villa'], correct: 1 },
        { q: 'Would you rather...', options: ['Cook a gourmet meal together', 'Order takeaway and watch movies'], correct: 0 },
      ],
    },
    {
      id: 'this-that',
      title: 'This or That?',
      emoji: '⚖️',
      folder: 'dates',
      questions: [
        { q: 'Choose one:', options: ['Early Morning Sunrise 🌅', 'Late Night Stargazing 🌌'], correct: 1 },
        { q: 'Choose one:', options: ['Road Trip 🚗', 'Flight Destination ✈️'], correct: 0 },
      ],
    },
    {
      id: 'truth-dare',
      title: 'Truth or Dare?',
      emoji: '🔥',
      folder: 'date-night',
      questions: [
        { q: 'TRUTH: What was the exact moment you realized you loved your partner?', options: ['Answer out loud together 💕'], correct: 0 },
        { q: 'DARE: Give your partner a 30-second back massage right now!', options: ['Challenge accepted! 🙌'], correct: 0 },
      ],
    },
    {
      id: 'guess-answer',
      title: 'Guess My Answer?',
      emoji: '🔮',
      folder: 'general',
      questions: [
        { q: 'Guess what your partner loves most about date nights:', options: ['The deep conversations', 'Trying new food', 'Dressing up together', 'The quiet cuddle time'], correct: 0 },
      ],
    },
  ]

  const currentGameObj = gamesList.find((g) => g.id === activeGame)

  const handleSelectOption = (idx) => {
    setSelectedOption(idx)
    setRevealed(true)
    if (currentGameObj && idx === currentGameObj.questions[questionIdx].correct) {
      setScore((s) => s + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentGameObj && questionIdx + 1 < currentGameObj.questions.length) {
      setQuestionIdx((q) => q + 1)
      setSelectedOption(null)
      setRevealed(false)
    } else {
      alert(`Game Complete! Score: ${score + (selectedOption === currentGameObj?.questions[questionIdx]?.correct ? 1 : 0)} / ${currentGameObj?.questions.length}`)
      setActiveGame(null)
      setQuestionIdx(0)
      setSelectedOption(null)
      setRevealed(false)
      setScore(0)
    }
  }

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <span className="text-xs font-bold text-[#C44569] uppercase tracking-wider bg-[#FFF1F4] px-3 py-1 rounded-full">
            Relationship Games Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#681F3B] mt-3">
            Couple Games for Two
          </h1>
          <p className="text-sm text-[#75676E] mt-1">
            Pick a game to challenge your partner, learn secret details, and have fun together!
          </p>
        </div>

        {!activeGame ? (
          /* Games Selector Grid with Visual Image Covers */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gamesList.map((g) => (
              <div
                key={g.id}
                className="bg-white rounded-3xl p-5 border border-[#EADDE2] shadow-sm hover:shadow-xl transition-all card-hover flex flex-col justify-between"
              >
                <div>
                  <CoupleImage folder={g.folder} alt={g.title} className="w-full h-36 rounded-2xl object-cover mb-4" aspect="16/9" />
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{g.emoji}</span>
                    <h3 className="text-lg font-serif font-bold text-[#681F3B]">{g.title}</h3>
                  </div>
                  <p className="text-xs text-[#75676E] mt-2">
                    {g.questions.length} Questions prepared for two partners.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveGame(g.id)
                    setQuestionIdx(0)
                    setScore(0)
                  }}
                  className="mt-6 w-full btn-primary py-2.5 text-xs font-bold"
                >
                  Start Game ❤️
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* Active Game Screen */
          <div className="bg-white rounded-3xl p-8 border border-[#EADDE2] shadow-xl max-w-2xl mx-auto animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-[#EADDE2]">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentGameObj.emoji}</span>
                <h3 className="font-serif font-bold text-lg text-[#681F3B]">{currentGameObj.title}</h3>
              </div>
              <button
                onClick={() => setActiveGame(null)}
                className="text-xs text-[#75676E] hover:text-[#C44569] font-semibold"
              >
                ✕ Exit Game
              </button>
            </div>

            <div className="my-6">
              <div className="flex items-center justify-between text-xs text-[#75676E] mb-2 font-semibold">
                <span>Question {questionIdx + 1} of {currentGameObj.questions.length}</span>
                <span>Score: {score}</span>
              </div>
              <div className="w-full bg-[#EADDE2] h-2 rounded-full overflow-hidden mb-6">
                <div
                  className="bg-[#C44569] h-full transition-all duration-300"
                  style={{ width: `${((questionIdx + 1) / currentGameObj.questions.length) * 100}%` }}
                />
              </div>

              <h4 className="text-xl font-serif font-bold text-[#2B2025] mb-6">
                {currentGameObj.questions[questionIdx].q}
              </h4>

              <div className="space-y-3">
                {currentGameObj.questions[questionIdx].options.map((opt, idx) => (
                  <button
                    key={idx}
                    disabled={revealed}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-2xl border text-left text-sm font-semibold transition-all ${
                      selectedOption === idx
                        ? 'border-[#C44569] bg-[#FFF1F4] text-[#681F3B] shadow-sm'
                        : 'border-[#EADDE2] bg-[#FFF9F7] text-[#2B2025] hover:border-[#C44569]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {revealed && (
                <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 animate-fadeIn">
                  <p className="font-bold">✨ {partnerName} answered the exact same option!</p>
                  <p className="mt-1">Both partners matched on this answer!</p>
                </div>
              )}
            </div>

            {revealed && (
              <button
                onClick={handleNextQuestion}
                className="w-full btn-primary py-3 text-sm font-bold flex items-center justify-center gap-2"
              >
                <span>{questionIdx + 1 < currentGameObj.questions.length ? 'Next Question' : 'View Results'}</span>
                <span>→</span>
              </button>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
