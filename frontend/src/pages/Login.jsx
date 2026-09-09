import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import CoupleImage from '../components/CoupleImage'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  // 2-Step OTP Modal State
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [otpEmail, setOtpEmail] = useState('')
  const [otpError, setOtpError] = useState(null)
  const [otpLoading, setOtpLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  const navigate = useNavigate()
  const { login, verifyOtp, resendOtp } = useAuth()

  useEffect(() => {
    let timer
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown((prev) => prev - 1), 1000)
    }
    return () => clearInterval(timer)
  }, [resendCooldown])

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)
    setLoading(true)
    try {
      const res = await login({ email, password })
      if (res && res.requiresOtp) {
        setOtpEmail(res.email || email)
        setShowOtpModal(true)
        setResendCooldown(30)
      } else {
        setSuccessMessage('Welcome to JustUs ❤️')
        setTimeout(() => navigate('/dashboard'), 800)
      }
    } catch (err) {
      setErrorMessage(err?.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault()
    setOtpError(null)
    setOtpLoading(true)
    try {
      const res = await verifyOtp({ email: otpEmail, otp: otpCode })
      setSuccessMessage(res?.message || 'Welcome to JustUs ❤️')
      setShowOtpModal(false)
      setTimeout(() => navigate('/dashboard'), 800)
    } catch (err) {
      setOtpError(err?.message || 'Invalid 6-digit OTP code. Please try again.')
    } finally {
      setOtpLoading(false)
    }
  }

  async function handleResendOtp() {
    if (resendCooldown > 0) return
    setOtpError(null)
    try {
      await resendOtp({ email: otpEmail })
      setResendCooldown(30)
      setOtpError('A new 6-digit OTP has been sent to your email.')
    } catch (err) {
      setOtpError(err?.message || 'Failed to resend OTP code.')
    }
  }

  const handleDemoFill = () => {
    setEmail('alex@example.com')
    setPassword('password123')
  }

  return (
    <div className="min-h-screen bg-[#FDF0F3] flex items-center justify-center p-4 sm:p-6 text-[#2B2025] relative overflow-hidden">
      {/* Background Aesthetic Container */}
      <div className="max-w-5xl w-full bg-white rounded-3xl border border-[#F7DDE4] shadow-2xl overflow-hidden grid md:grid-cols-12 min-h-[640px] relative">
        {/* LEFT COLUMN: Aesthetic Sunset Room Hero Panel */}
        <div className="md:col-span-6 bg-gradient-to-br from-[#FFF0F4] via-[#F7DDE4] to-[#E98BA5]/30 p-8 flex flex-col justify-between relative overflow-hidden border-r border-[#F7DDE4]">
          {/* Ambient Background Glows */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/50 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#C44569]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Logo & Tagline */}
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 text-2xl font-serif font-bold text-[#681F3B]">
              <span className="w-8 h-8 rounded-full bg-[#C44569] text-white flex items-center justify-center text-sm shadow-sm">♥</span>
              <span>Melody<span className="font-sans font-light italic text-[#C44569]">Space</span></span>
            </Link>
            <p className="text-[11px] text-[#75676E] tracking-widest font-semibold mt-1 uppercase">
              Your Music • Your Vibes • Your Space
            </p>
          </div>

          {/* Quote & Main Visual Image */}
          <div className="my-auto relative z-10 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-serif text-[#681F3B] leading-tight">
              Music Makes <br />
              <span className="italic font-normal text-[#C44569]">Everything Better</span> <span className="text-[#C44569]">♡</span>
            </h2>

            {/* Cozy Room Aesthetic Card */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] group">
              <CoupleImage folder="hero" alt="Cozy sunset music room view" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" aspect="4/3" eager />
              <div className="absolute inset-0 bg-gradient-to-t from-[#681F3B]/50 via-transparent to-transparent pointer-events-none" />

              {/* Floating Music Controller Overlay */}
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-white/60 shadow-lg flex flex-col items-center gap-2 text-xs text-[#C44569]">
                <span>❤️</span>
                <span>▶</span>
                <span>🎵</span>
              </div>
            </div>

            {/* Floating Audio Waveform Pill Badge */}
            <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/80 shadow-md text-xs font-semibold text-[#681F3B]">
              <span className="text-base animate-pulse">〰️🎵</span>
              <div>
                <p className="text-xs font-bold">Good Music</p>
                <p className="text-[10px] text-[#75676E]">Good Mood</p>
              </div>
            </div>
          </div>

          {/* Bottom Pill */}
          <div className="relative z-10 text-xs font-semibold text-[#75676E]">
            © 2026 MelodySpace • JustUs ❤️
          </div>
        </div>

        {/* RIGHT COLUMN: Floating Login Form Card */}
        <div className="md:col-span-6 p-8 sm:p-10 flex flex-col justify-between bg-white relative">
          <div>
            {/* Header */}
            <div>
              <span className="text-[11px] font-bold text-[#75676E] tracking-widest uppercase">
                Welcome Back —
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#681F3B] mt-2 leading-tight">
                Log In to Your <br />
                <span className="text-[#C44569] italic font-serif font-normal">MelodySpace</span> <span className="text-[#C44569] text-3xl">♡</span>
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-[#75676E]">
                Continue your musical journey. Your space is just a login away!
              </p>
            </div>

            {/* Success Toast */}
            {successMessage && (
              <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold animate-fadeIn flex items-center gap-2">
                <span>❤️</span>
                <span>{successMessage}</span>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold animate-fadeIn">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
              {/* Email ID */}
              <div>
                <label className="block font-semibold text-[#681F3B] mb-1">Email ID</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#75676E] text-sm">✉️</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Email ID"
                    className="w-full p-3 pl-10 rounded-2xl border border-[#F7DDE4] text-sm focus:outline-none focus:border-[#C44569] bg-[#FFF9F7]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block font-semibold text-[#681F3B] mb-1">Password</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#75676E] text-sm">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Password"
                    className="w-full p-3 pl-10 pr-10 rounded-2xl border border-[#F7DDE4] text-sm focus:outline-none focus:border-[#C44569] bg-[#FFF9F7]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#75676E] text-xs hover:text-[#C44569]"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-[#75676E]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#F7DDE4] accent-[#C44569]"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleDemoFill}
                  className="text-[#C44569] font-bold hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#C44569] via-[#D85078] to-[#9E3155] text-white font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2 mt-4"
              >
                <span>{loading ? 'Verifying Account...' : 'Log In'}</span>
                <span>→</span>
              </button>

              <div className="relative text-center my-4">
                <div className="divider"><span>Or</span></div>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleDemoFill}
                className="w-full py-3 rounded-full border border-[#EADDE2] bg-white hover:bg-[#FFF9F7] text-xs font-semibold text-[#2B2025] flex items-center justify-center gap-2 transition-colors"
              >
                <span>🌐</span>
                <span>Continue with Google</span>
              </button>
            </form>
          </div>

          {/* Bottom Sign Up Link */}
          <div className="mt-8 text-center text-xs text-[#75676E] flex items-center justify-center gap-1">
            <span>Don't have an account?</span>
            <Link to="/signup" className="text-[#C44569] font-bold hover:underline">
              Sign Up
            </Link>
            <span className="text-[#C44569] text-base">♡</span>
          </div>
        </div>
      </div>

      {/* 2-STEP EMAIL OTP VERIFICATION MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 border border-[#F7DDE4] shadow-2xl relative">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#FFF0F4] text-[#C44569] flex items-center justify-center text-2xl mx-auto shadow-inner">
                ✉️
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#681F3B]">Email OTP Verification</h3>
              <p className="text-xs text-[#75676E]">
                We have sent a 6-digit verification code to <br />
                <span className="font-semibold text-[#681F3B]">{otpEmail}</span>
              </p>
            </div>

            {otpError && (
              <div className="mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold text-center">
                {otpError}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#681F3B] text-center mb-2">
                  Enter 6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  required
                  placeholder="• • • • • •"
                  className="w-full py-3.5 px-4 text-center text-2xl tracking-[0.5em] font-mono font-bold rounded-2xl border-2 border-[#F7DDE4] focus:border-[#C44569] focus:outline-none bg-[#FFF9F7]"
                />
              </div>

              <button
                type="submit"
                disabled={otpLoading || otpCode.length < 6}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#C44569] to-[#9E3155] text-white font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50"
              >
                {otpLoading ? 'Verifying OTP...' : 'Verify OTP & Log In ❤️'}
              </button>
            </form>

            <div className="mt-4 flex items-center justify-between text-xs text-[#75676E]">
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="hover:underline hover:text-[#681F3B]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0}
                className="text-[#C44569] font-bold hover:underline disabled:opacity-50"
              >
                {resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : 'Resend OTP Code'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
