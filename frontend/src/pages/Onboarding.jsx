import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import CoupleImage from '../components/CoupleImage'
import HeartBurstAnimation from '../components/HeartBurstAnimation'

export default function Onboarding() {
  const { user, connectSpace, spaceConnection, createConnectionCode } = useAuth()
  const navigate = useNavigate()
  const [inputCode, setInputCode] = useState('')
  const ownInviteCode = spaceConnection?.createdCode || spaceConnection?.code || (user ? createConnectionCode() : 'JUSTUS-8842')
  const [copied, setCopied] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [showBurst, setShowBurst] = useState(false)

  const handleCopyOwnCode = () => {
    navigator.clipboard?.writeText(ownInviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleConnectSubmit = (e) => {
    e.preventDefault()
    if (!inputCode.trim()) {
      setErrorMsg('Please enter a valid partner connection code!')
      return
    }
    setErrorMsg('')
    connectSpace(inputCode)
    setShowBurst(true)
  }

  const handleLetsGo = () => {
    if (inputCode.trim()) {
      connectSpace(inputCode)
      setShowBurst(true)
    } else {
      navigate('/dashboard')
    }
  }

  const handleBurstComplete = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#FDF0F3] flex items-center justify-center p-4 sm:p-6 text-[#2B2025] relative">
      {/* Heart Burst Connection Animation */}
      <HeartBurstAnimation active={showBurst} onComplete={handleBurstComplete} />

      <div className="max-w-5xl w-full bg-white rounded-3xl border border-[#F7DDE4] shadow-2xl overflow-hidden grid md:grid-cols-12 min-h-[640px]">
        {/* LEFT COLUMN: Features & Connection Box */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-between bg-white border-r border-[#F7DDE4]">
          <div>
            {/* Top Bar Header */}
            <div className="flex items-center justify-between pb-6 border-b border-[#F7DDE4]">
              <div>
                <Link to="/" className="flex items-center gap-2 text-2xl font-serif font-bold text-[#681F3B]">
                  <span className="w-8 h-8 rounded-full bg-[#C44569] text-white flex items-center justify-center text-sm shadow-sm">♥</span>
                  <span>Melody<span className="font-sans font-light italic text-[#C44569]">Space</span></span>
                </Link>
                <p className="text-[11px] text-[#75676E] tracking-widest font-semibold mt-0.5 uppercase">
                  Music • Videos • Your Space
                </p>
              </div>

              <Link to="/dashboard" className="text-xs font-semibold text-[#75676E] hover:text-[#C44569] flex items-center gap-1">
                Skip to Dashboard <span>→</span>
              </Link>
            </div>

            {/* Main Headline */}
            <div className="mt-6">
              <span className="text-[11px] font-bold text-[#C44569] tracking-widest uppercase bg-[#FFF0F4] px-3 py-1 rounded-full border border-[#F7DDE4]">
                STEP 2 OF 2: CONNECT YOUR SPACE
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#681F3B] mt-3 leading-tight">
                Connect With Your <br />
                <span className="font-serif italic font-normal text-[#C44569]">Partner</span>{' '}
                <span className="text-[#C44569] text-2xl">♡</span>
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-[#75676E] max-w-md leading-relaxed">
                Enter your partner's connection code below to link your private space together.
              </p>
            </div>

            {/* PROMINENT CONNECTION CODE INPUT FORM */}
            <form onSubmit={handleConnectSubmit} className="mt-6 p-5 rounded-2xl bg-[#FFF9F7] border border-[#F7DDE4] shadow-xs space-y-3">
              <label className="block text-xs font-bold text-[#681F3B] uppercase tracking-wider">
                🔑 Enter Partner's Connection Code
              </label>

              <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => {
                    setInputCode(e.target.value.toUpperCase())
                    setErrorMsg('')
                  }}
                  placeholder="e.g. JUSTUS-8842"
                  className="flex-1 px-4 py-3 rounded-xl border border-[#EADDE2] text-sm font-mono font-bold tracking-wider text-[#681F3B] uppercase focus:outline-none focus:border-[#C44569] bg-white shadow-xs"
                />

                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-[#681F3B] hover:bg-[#9E3155] text-white font-bold text-xs shadow-md transition-colors shrink-0 flex items-center justify-center gap-1.5"
                >
                  <span>Connect Space</span>
                  <span>♡</span>
                </button>
              </div>

              {errorMsg && <p className="text-xs text-rose-600 font-semibold">{errorMsg}</p>}

              {/* OR SHARE YOUR CODE BOX */}
              <div className="pt-3 border-t border-[#F7DDE4] flex items-center justify-between gap-3 text-xs">
                <span className="text-[#75676E] font-medium">Your own invite code:</span>
                <button
                  type="button"
                  onClick={handleCopyOwnCode}
                  className="px-3 py-1.5 rounded-lg bg-[#FFF0F4] text-[#C44569] border border-[#F7DDE4] font-mono font-bold hover:bg-[#F7DDE4] transition-colors flex items-center gap-1"
                >
                  <span>{ownInviteCode}</span>
                  <span className="text-[10px]">{copied ? '✓ Copied' : '📋 Copy'}</span>
                </button>
              </div>
            </form>

            {/* 3 Circular Feature Rows */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FFF9F7] transition-colors">
                <div className="w-9 h-9 rounded-full bg-[#FFF0F4] text-[#C44569] flex items-center justify-center text-sm shrink-0 border border-[#F7DDE4]">
                  🎵
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xs text-[#681F3B]">Synchronized Music & Videos</h4>
                  <p className="text-[11px] text-[#75676E]">Listen to songs and watch videos in real-time frame sync.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FFF9F7] transition-colors">
                <div className="w-9 h-9 rounded-full bg-[#FFF0F4] text-[#C44569] flex items-center justify-center text-sm shrink-0 border border-[#F7DDE4]">
                  💬
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xs text-[#681F3B]">Private End-to-End Chat</h4>
                  <p className="text-[11px] text-[#75676E]">Send instant real-time messages, heart reactions, and photos.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button & Navigation */}
          <div className="mt-6 pt-4 border-t border-[#F7DDE4] space-y-3">
            <button
              onClick={handleLetsGo}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#C44569] via-[#D85078] to-[#9E3155] text-white font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
            >
              <span>{inputCode ? 'Submit & Enter Space' : 'Let\'s Go →'}</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Cozy Window Aesthetic Visual */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#FFF0F4] via-[#F7DDE4] to-[#E98BA5]/30 p-8 flex flex-col justify-between relative overflow-hidden">
          {/* Top Skip badge */}
          <div className="flex justify-end relative z-10">
            <span className="text-[10px] font-bold text-[#681F3B] bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-white/60">
              Good Vibes Only 💕
            </span>
          </div>

          {/* Main Visual Image Card */}
          <div className="my-auto relative z-10">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] group">
              <CoupleImage folder="hero" alt="Cozy romantic window view aesthetic" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" aspect="4/5" eager />
              <div className="absolute inset-0 bg-gradient-to-t from-[#681F3B]/60 via-transparent to-transparent pointer-events-none" />

              {/* Musical Note Overlay Pill */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2.5 rounded-2xl shadow-lg border border-white text-base text-[#C44569]">
                🎵
              </div>

              {/* Bottom Quote Overlay */}
              <div className="absolute bottom-6 left-6 right-6 text-white text-center">
                <p className="text-lg font-serif font-bold drop-shadow">Welcome Home</p>
                <p className="text-xs text-white/90 drop-shadow mt-0.5">Two people. One private space.</p>
              </div>
            </div>
          </div>

          {/* Bottom Branding Pill */}
          <div className="relative z-10 text-center text-xs font-semibold text-[#75676E]">
            © 2026 MelodySpace • JustUs ❤️
          </div>
        </div>
      </div>
    </div>
  )
}

