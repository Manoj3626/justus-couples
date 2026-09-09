import React, { useState, useEffect, useRef } from 'react'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../contexts/AuthContext'

export default function ChatPage() {
  const { user, spaceConnection, chatMessages, sendChatMessage, fetchChatMessages } = useAuth()
  const currentUserName = user?.firstName || 'User'
  const partnerName = spaceConnection?.partnerName || 'Partner'

  const [inputText, setInputText] = useState('')
  const chatEndRef = useRef(null)

  // Fetch chat history on mount
  useEffect(() => {
    fetchChatMessages?.()
  }, [])

  // Auto-scroll on new messages
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
      console.error('Failed to send message:', err)
    }
  }

  const addEmoji = (emoji) => {
    setInputText((prev) => prev + ' ' + emoji)
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto h-[calc(100dvh-120px)] sm:h-[calc(100vh-140px)] min-h-[480px] flex flex-col bg-white rounded-2xl sm:rounded-3xl border border-[#EADDE2] shadow-xl overflow-hidden animate-fadeIn">
        {/* Chat Header */}
        <div className="p-4 sm:p-5 bg-[#FFF9F7] border-b border-[#EADDE2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-[#9E3155] text-white font-serif font-bold text-lg flex items-center justify-center border-2 border-white shadow-sm">
                {partnerName.charAt(0)}
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#681F3B]">
                {partnerName} ❤️
              </h3>
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <span>●</span> Connected Live • Real-time Sync
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#681F3B] bg-[#FFF1F4] px-3 py-1.5 rounded-full border border-[#F7DDE4] flex items-center gap-1.5">
              <span>🔒</span> Private 2-Person Chat
            </span>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#FFF9F7]/50">
          {chatMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#FFF1F4] text-[#C44569] flex items-center justify-center text-2xl">
                💬
              </div>
              <h3 className="text-lg font-serif font-bold text-[#681F3B]">No messages yet.</h3>
              <p className="text-xs text-[#75676E] max-w-xs">
                Send your first real message to start chatting with {partnerName} in your private space!
              </p>
            </div>
          ) : (
            chatMessages.map((msg, index) => {
              const senderName = msg.senderName || msg.sender?.firstName || (typeof msg.sender === 'string' ? msg.sender : 'User')
              const senderIdStr = msg.sender?._id?.toString() || msg.senderId?.toString() || (typeof msg.sender === 'string' ? msg.sender : '')
              const isSelf = (user?._id && senderIdStr === user._id.toString()) || senderName === currentUserName || msg.self
              const timeStr = msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : msg.time || ''

              return (
                <div
                  key={msg._id || index}
                  className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'} animate-fadeIn`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[11px] text-[#75676E]">
                    <span className="font-semibold text-[#681F3B]">{senderName}</span>
                    {timeStr && <span>• {timeStr}</span>}
                  </div>

                  <div
                    className={`max-w-[80%] sm:max-w-[65%] p-4 rounded-2xl shadow-xs text-xs sm:text-sm leading-relaxed ${
                      isSelf
                        ? 'bg-[#C44569] text-white rounded-tr-none font-medium'
                        : 'bg-[#F7DDE4] text-[#2B2025] border border-[#EADDE2] rounded-tl-none font-medium'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              )
            })
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Emoji Bar */}
        <div className="px-4 py-2 bg-white border-t border-[#EADDE2] flex items-center gap-2 overflow-x-auto text-base">
          <span className="text-xs text-[#75676E] font-semibold mr-1 shrink-0">Quick Reaction:</span>
          {['❤️', '💖', '😍', '😂', '✨', '🌴', '🍷', '🥂', '🍿', '🌹'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => addEmoji(emoji)}
              className="p-1.5 rounded-lg hover:bg-[#FFF1F4] transition-colors shrink-0"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-[#EADDE2] flex items-center gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Write a live message for ${partnerName}...`}
            className="flex-1 p-3 rounded-2xl border border-[#EADDE2] text-xs sm:text-sm focus:outline-none focus:border-[#C44569] bg-[#FFF9F7]"
          />
          <button
            type="submit"
            className="btn-primary px-6 py-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 shrink-0 shadow-md"
          >
            <span>Send</span>
            <span>❤️</span>
          </button>
        </form>
      </div>
    </AppLayout>
  )
}
