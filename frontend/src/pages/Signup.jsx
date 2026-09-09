import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import CoupleImage from '../components/CoupleImage'

export default function Signup() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { signup } = useAuth()

  // Real-time validations
  const isValidEmail = email.includes('@') && email.includes('.')
  const isMinLength = password.length >= 8
  const hasNumAndSpecial = /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match! Please check your password input.')
      return
    }

    setLoading(true)
    try {
      await signup({ firstName: fullName || 'User', email, password, confirmPassword })
      setSuccessMessage('Account created successfully! Redirecting to login...')
      setTimeout(() => navigate('/login'), 1200)
    } catch (err) {
      setErrorMessage(err?.message || 'Sign up failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDF0F3] flex items-center justify-center p-4 sm:p-6 text-[#2B2025]">
      <div className="max-w-5xl w-full bg-white rounded-3xl border border-[#F7DDE4] shadow-2xl overflow-hidden grid md:grid-cols-12 min-h-[640px]">
        {/* LEFT COLUMN: Aesthetic Hero Card */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#FFF0F4] via-[#F7DDE4] to-[#E98BA5]/30 p-8 flex flex-col justify-between relative overflow-hidden border-r border-[#F7DDE4]">
          {/* Ambient Background Glows */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#C44569]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Logo & Tagline */}
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 text-2xl font-serif font-bold text-[#681F3B]">
              <span className="w-8 h-8 rounded-full bg-[#C44569] text-white flex items-center justify-center text-sm shadow-sm">♥</span>
              <span>Melody<span className="font-sans font-light italic text-[#C44569]">Space</span></span>
            </Link>
            <p className="text-[11px] text-[#75676E] tracking-widest font-semibold mt-1 uppercase">
              Music • Videos • Your Space
            </p>
          </div>

          {/* Center Quote & Visual Card */}
          <div className="my-8 relative z-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-serif text-[#681F3B] leading-snug">
              Good Music & <br />
              <span className="italic text-[#C44569]">Moments Bring People</span> <br />
              Together <span className="text-[#C44569]">♡</span>
            </h2>

            {/* Aesthetic Visual Image */}
            <div className="mt-6 mx-auto w-48 h-48 rounded-3xl bg-white p-3 shadow-xl border border-white/60 relative overflow-hidden group">
              <CoupleImage folder="music" alt="Aesthetic headphone music couple visual" className="w-full h-full rounded-2xl object-cover" aspect="1/1" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#C44569]/30 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Bottom 3 Feature Pills */}
          <div className="relative z-10 grid grid-cols-3 gap-2 text-center text-[10px] font-semibold text-[#681F3B]">
            <div className="bg-white/80 backdrop-blur-sm p-2 rounded-2xl border border-white/60 shadow-xs">
              <span className="block text-base mb-0.5">🎵</span>
              <span>Listen Your Way</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-2 rounded-2xl border border-white/60 shadow-xs">
              <span className="block text-base mb-0.5">▶</span>
              <span>Watch Your Stories</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-2 rounded-2xl border border-white/60 shadow-xs">
              <span className="block text-base mb-0.5">❤️</span>
              <span>Create Your Space</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sign Up Form */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            {/* Top Navigation Link */}
            <div className="flex justify-start mb-6">
              <Link to="/" className="text-xs font-semibold text-[#75676E] hover:text-[#C44569] flex items-center gap-1.5 transition-colors">
                <span>←</span> Back to Home
              </Link>
            </div>

            {/* Header */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#681F3B]">
                Sign <span className="text-[#C44569]">Up</span>
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-[#75676E]">
                Create your account and start your music, video, and couple space journey.
              </p>
            </div>

            {/* Success Toast */}
            {successMessage && (
              <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold animate-fadeIn">
                🎉 {successMessage}
              </div>
            )}

            {/* Error Badge */}
            {errorMessage && (
              <div className="mt-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold animate-fadeIn">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
              {/* Full Name */}
              <div>
                <label className="block font-semibold text-[#681F3B] mb-1">Full Name</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#75676E] text-sm">👤</span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                    className="w-full p-3 pl-10 rounded-2xl border border-[#F7DDE4] text-sm focus:outline-none focus:border-[#C44569] bg-[#FFF9F7]"
                  />
                </div>
              </div>

              {/* Email / User ID */}
              <div>
                <label className="block font-semibold text-[#681F3B] mb-1">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#75676E] text-sm">✉️</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email address"
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
                    placeholder="Create a password"
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

              {/* Confirm Password */}
              <div>
                <label className="block font-semibold text-[#681F3B] mb-1">Confirm Password</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#75676E] text-sm">🔒</span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm your password"
                    className="w-full p-3 pl-10 pr-10 rounded-2xl border border-[#F7DDE4] text-sm focus:outline-none focus:border-[#C44569] bg-[#FFF9F7]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#75676E] text-xs hover:text-[#C44569]"
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Password Requirements Checklist */}
              <div className="space-y-1 pt-1 text-[11px]">
                <p className={`flex items-center gap-1.5 ${isValidEmail ? 'text-emerald-600 font-semibold' : 'text-[#75676E]'}`}>
                  <span>{isValidEmail ? '✓' : '•'}</span> Use a valid email ID
                </p>
                <p className={`flex items-center gap-1.5 ${isMinLength ? 'text-emerald-600 font-semibold' : 'text-[#75676E]'}`}>
                  <span>{isMinLength ? '✓' : '•'}</span> Password must be at least 8 characters
                </p>
                <p className={`flex items-center gap-1.5 ${hasNumAndSpecial ? 'text-emerald-600 font-semibold' : 'text-[#75676E]'}`}>
                  <span>{hasNumAndSpecial ? '✓' : '•'}</span> Include a number and special character
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#C44569] via-[#D85078] to-[#9E3155] text-white font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2 mt-4"
              >
                <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
                <span>→</span>
              </button>

              <div className="relative text-center my-4">
                <div className="divider"><span>or</span></div>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={() => {
                  setFullName('User')
                  setEmail('testuser@example.com')
                  setPassword('Password123!')
                  setConfirmPassword('Password123!')
                }}
                className="w-full py-3 rounded-full border border-[#EADDE2] bg-white hover:bg-[#FFF9F7] text-xs font-semibold text-[#2B2025] flex items-center justify-center gap-2 transition-colors"
              >
                <span>🌐</span>
                <span>Continue with Google (Demo Auto-Fill)</span>
              </button>
            </form>
          </div>

          {/* Bottom Login Link */}
          <div className="mt-6 text-center text-xs text-[#75676E]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#C44569] font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
