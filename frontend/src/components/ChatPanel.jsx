import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function ChatPanel({ onClose, title = 'Private Chat', variant = 'dark' }) {
  const { user, spaceConnection, chatMessages, sendChatMessage, fetchChatMessages } = useAuth()
  const partnerName = spaceConnection?.partnerName || 'Partner'
  const currentUserId = user?._id?.toString() || user?.id?.toString() || ''

  const [inputText, setInputText] = useState('')
  const chatEndRef = useRef(null)

  useEffect(() => {
    fetchChatMessages?.()
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const textToSend = inputText.trim()
    setInputText('')

    try {
      await sendChatMessage?.(textToSend)
    } catch (err) {
      console.error('Failed to send chat message:', err)
    }
  }

  const QUICK_EMOJIS = ['❤️', '😘', '💖', '😍', '🎶', '✨', '🌹']
  const isLight = variant === 'light'

  return (
    <div
      className={`w-full h-full flex flex-col shadow-xl relative z-30 overflow-hidden animate-fadeIn ${
        isLight
          ? 'bg-white border border-[#F7DDE4] rounded-3xl text-[#2B2025]'
          : 'md:w-80 lg:w-96 bg-[#1A0C18]/95 backdrop-blur-xl border-l border-white/10 text-white'
      }`}
    >
      {/* Header */}
      <div
        className={`p-4 flex items-center justify-between border-b ${
          isLight ? 'bg-[#FFF0F4] border-[#F7DDE4]' : 'bg-white/5 border-white/10'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-xl">💬</span>
          <div>
            <h3 className={`font-serif font-bold text-sm ${isLight ? 'text-[#681F3B]' : 'text-white'}`}>
              {title}
            </h3>
            <p className={`text-[10px] ${isLight ? 'text-[#75676E]' : 'text-white/60'}`}>
              Live with {partnerName}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors ${
              isLight ? 'hover:bg-[#F7DDE4] text-[#681F3B]' : 'hover:bg-white/10 text-white/70 hover:text-white'
            }`}
            title="Close Chat"
          >
            ✕
          </button>
        )}
      </div>

      {/* Messages */}
      <div className={`flex-1 p-4 overflow-y-auto space-y-3 font-sans ${isLight ? 'bg-[#FFF9F7]/50' : ''}`}>
        {!chatMessages || !Array.isArray(chatMessages) || chatMessages.length === 0 ? (
          <div className={`h-full flex flex-col items-center justify-center text-center p-4 text-xs ${isLight ? 'text-[#75676E]' : 'text-white/40'}`}>
            <span>💬 No messages yet</span>
          </div>
        ) : (
          chatMessages.map((msg, idx) => {
            if (!msg) return null
            const senderId = typeof msg.sender === 'string'
              ? msg.sender
              : (msg.sender?._id?.toString() || msg.sender?.id?.toString() || msg.senderId?.toString() || '')
            const isSelf = Boolean(msg.self || (currentUserId && senderId && senderId === currentUserId))
            return (
              <div
                key={msg._id || idx}
                className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-xs ${
                    isSelf
                      ? 'bg-gradient-to-r from-[#C44569] to-[#9E3155] text-white rounded-br-none shadow-md'
                      : isLight
                      ? 'bg-[#FFF0F4] text-[#681F3B] border border-[#F7DDE4] rounded-bl-none'
                      : 'bg-white/10 text-white border border-white/10 rounded-bl-none'
                  }`}
                >
                  <p className="break-words leading-relaxed">{msg.text || ''}</p>
                </div>
                <span className={`text-[9px] mt-1 px-1 ${isLight ? 'text-[#75676E]' : 'text-white/40'}`}>
                  {msg.time || ''}
                </span>
              </div>
            )
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Emojis */}
      <div
        className={`px-3 py-1.5 flex items-center justify-between gap-1 overflow-x-auto border-t ${
          isLight ? 'bg-[#FFF0F4] border-[#F7DDE4]' : 'bg-white/5 border-white/10'
        }`}
      >
        {QUICK_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => setInputText((prev) => prev + emoji)}
            className="p-1 text-sm hover:scale-125 transition-transform"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSend}
        className={`p-3 flex items-center gap-2 border-t ${
          isLight ? 'bg-[#FFF0F4] border-[#F7DDE4]' : 'bg-white/5 border-white/10'
        }`}
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Message ${partnerName}...`}
          className={`flex-1 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C44569] ${
            isLight
              ? 'bg-white border border-[#EADDE2] text-[#2B2025] placeholder-[#75676E]'
              : 'bg-white/10 border border-white/15 text-white placeholder-white/40'
          }`}
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="px-3 py-2 rounded-xl bg-[#C44569] hover:bg-[#9E3155] text-white text-xs font-bold disabled:opacity-40 transition-all shadow-md shrink-0"
        >
          Send
        </button>
      </form>
    </div>
  )
}
