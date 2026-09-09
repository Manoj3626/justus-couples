import React, { useState } from 'react'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../contexts/AuthContext'

export default function SettingsPage() {
  const { user, spaceConnection } = useAuth()
  const partnerName = spaceConnection?.partnerName || 'Partner'

  const [activeTab, setActiveTab] = useState('account')
  const [msgNotify, setMsgNotify] = useState(true)
  const [dateNotify, setDateNotify] = useState(true)
  const [gameNotify, setGameNotify] = useState(true)

  // AI Assistant Chat Panel State
  const [aiPrompts, setAiPrompts] = useState([
    { role: 'assistant', text: `Hello! I am your JustUs Date Assistant. How can I help you and ${partnerName} plan your next special moment?` },
  ])
  const [aiInput, setAiInput] = useState('')

  const handleSendAi = (e) => {
    e.preventDefault()
    if (!aiInput.trim()) return
    const userMsg = aiInput
    setAiPrompts((prev) => [...prev, { role: 'user', text: userMsg }])
    setAiInput('')
    setTimeout(() => {
      setAiPrompts((prev) => [
        ...prev,
        { role: 'assistant', text: `✨ Here is a date idea for "${userMsg}": Plan a candlelit homemade dessert tasting followed by a cozy stargazing playlist!` },
      ])
    }, 800)
  }

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <span className="text-xs font-bold text-[#C44569] uppercase tracking-wider bg-[#FFF1F4] px-3 py-1 rounded-full">
            Space Settings & AI
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#681F3B] mt-3">
            Settings & AI Assistant
          </h1>
          <p className="text-sm text-[#75676E] mt-1">
            Configure your notifications, privacy preferences, and test the AI Date Assistant.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-[#EADDE2] pb-3 overflow-x-auto">
          {['account', 'notifications', 'privacy', 'ai'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-[#681F3B] text-white shadow-sm'
                  : 'bg-white text-[#75676E] hover:bg-[#FFF1F4]'
              }`}
            >
              {tab === 'ai' ? '🤖 AI Date Assistant' : tab}
            </button>
          ))}
        </div>

        {/* Tab 1: Account */}
        {activeTab === 'account' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADDE2] shadow-sm max-w-xl space-y-4 text-xs">
            <h3 className="font-serif font-bold text-lg text-[#681F3B]">Account Settings</h3>
            <div>
              <label className="block font-semibold text-[#681F3B] mb-1">Display Name</label>
              <input type="text" defaultValue={user?.firstName || 'User'} className="w-full p-3 rounded-xl border border-[#EADDE2] text-sm" />
            </div>
            <div>
              <label className="block font-semibold text-[#681F3B] mb-1">Email</label>
              <input type="email" defaultValue={user?.email || 'user@example.com'} disabled className="w-full p-3 rounded-xl border border-[#EADDE2] bg-[#FFF9F7] text-sm text-gray-500" />
            </div>
            <button className="btn-primary px-6 py-2.5 text-xs font-bold mt-2">Save Account Changes</button>
          </div>
        )}

        {/* Tab 2: Notifications */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADDE2] shadow-sm max-w-xl space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#681F3B]">Notification Preferences</h3>

            <div className="flex items-center justify-between py-2 border-b border-[#EADDE2]">
              <div>
                <p className="text-xs font-bold text-[#2B2025]">Private Message Notifications</p>
                <p className="text-[11px] text-[#75676E]">Get notified when {partnerName} sends a message</p>
              </div>
              <input
                type="checkbox"
                checked={msgNotify}
                onChange={(e) => setMsgNotify(e.target.checked)}
                className="w-5 h-5 accent-[#C44569]"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-[#EADDE2]">
              <div>
                <p className="text-xs font-bold text-[#2B2025]">Upcoming Date Reminders</p>
                <p className="text-[11px] text-[#75676E]">Get reminders 24h before planned dates</p>
              </div>
              <input
                type="checkbox"
                checked={dateNotify}
                onChange={(e) => setDateNotify(e.target.checked)}
                className="w-5 h-5 accent-[#C44569]"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-xs font-bold text-[#2B2025]">Game Challenge Alerts</p>
                <p className="text-[11px] text-[#75676E]">Get notified when {partnerName} challenges you</p>
              </div>
              <input
                type="checkbox"
                checked={gameNotify}
                onChange={(e) => setGameNotify(e.target.checked)}
                className="w-5 h-5 accent-[#C44569]"
              />
            </div>
          </div>
        )}


        {/* Tab 3: Privacy */}
        {activeTab === 'privacy' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADDE2] shadow-sm max-w-xl space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#681F3B]">Privacy & Data Controls</h3>
            <p className="text-xs text-[#75676E]">
              Your space is locked to 2 members. Session tokens are encrypted in HttpOnly cookies.
            </p>
            <div className="p-4 rounded-2xl bg-[#FFF9F7] border border-[#EADDE2] space-y-2 text-xs">
              <p className="font-bold text-[#681F3B]">📥 Download Space Archive</p>
              <p className="text-[#75676E]">Download a zip of all your photos, chat logs, and date memories.</p>
              <button className="px-4 py-2 rounded-xl bg-white border border-[#EADDE2] font-semibold text-[#681F3B] hover:border-[#C44569]">
                Export Data
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: AI Assistant */}
        {activeTab === 'ai' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADDE2] shadow-xl max-w-2xl mx-auto space-y-4">
            <div className="pb-4 border-b border-[#EADDE2] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#681F3B] text-white font-bold flex items-center justify-center text-sm">
                  🤖
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#681F3B]">AI Date Planner</h3>
                  <p className="text-xs text-emerald-600 font-semibold">Active & Ready</p>
                </div>
              </div>
            </div>

            {/* AI Chat Messages */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 text-xs sm:text-sm">
              {aiPrompts.map((p, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl ${
                    p.role === 'assistant'
                      ? 'bg-[#FFF1F4] border border-[#F7DDE4] text-[#681F3B]'
                      : 'bg-[#681F3B] text-white ml-auto max-w-[80%]'
                  }`}
                >
                  <p className="font-bold text-[11px] mb-1">{p.role === 'assistant' ? '🤖 JustUs Assistant' : 'You'}</p>
                  <p>{p.text}</p>
                </div>
              ))}
            </div>

            {/* AI Input Form */}
            <form onSubmit={handleSendAi} className="pt-2 flex gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask for date ideas, low-budget plans, romantic surprises..."
                className="flex-1 p-3 rounded-2xl border border-[#EADDE2] text-xs focus:outline-none focus:border-[#C44569]"
              />
              <button type="submit" className="btn-primary px-6 py-3 text-xs font-bold">
                Ask AI ✨
              </button>
            </form>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
