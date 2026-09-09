import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import CoupleImage from '../components/CoupleImage'

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

export default function Signup() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  // OTP Modal State
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otpEmail, setOtpEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [otpError, setOtpError] = useState(null)
  const [otpLoading, setOtpLoading] = useState(false)

  const navigate = useNavigate()
  const { signup, verifyOtp, resendOtp } = useAuth()

  // Real-time validations
  const isValidEmail = EMAIL_REGEX.test(email.trim())
  const isMinLength = password.length >= 8
  const hasNumAndSpecial = /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!isValidEmail) {
      setErrorMessage('Please enter a valid email address.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match! Please check your password input.')
      return
    }

    setLoading(true)
    try {
      const res = await signup({ firstName: fullName || 'User', email: email.trim(), password, confirmPassword })
      if (res?.requiresOtp) {
        setOtpEmail(res.email || email.trim().toLowerCase())
        setOtpCode('')
        setOtpError(null)
        setShowOtpModal(true)
        setSuccessMessage(res.message || 'A 6-digit OTP verification code has been sent to your email.')
      } else {
        setSuccessMessage(res?.message || 'Account created successfully! Redirecting to login...')
        setTimeout(() => navigate('/login'), 1200)
      }
    } catch (err) {
      setErrorMessage(err?.message || 'Sign up failed. Please try again.')
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
      setOtpError(err?.message || 'OTP verification failed. Please try again.')
    } finally {
      setOtpLoading(false)
    }
  }

  async function handleResendOtp() {
    setOtpError(null)
    try {
      const res = await resendOtp({ email: otpEmail })
      setSuccessMessage(res?.message || 'A new verification code has been sent to your email.')
    } catch (err) {
      setOtpError(err?.message || 'Failed to resend code. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-[#FDF0F3] flex items-center justify-center p-4 sm:p-6 text-[#2B2025]">
      <div className="max-w-5xl w-full bg-white rounded-3xl border border-[#F7DDE4] shadow-2xl overflow-hidden grid md:grid-cols-12 min-h-[640px]">
        {/* LEFT COLUMN: Aesthetic Hero Card */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#FFF0F4] via-[#F7DDE4] to-[#E98BA5]/30 p-8 flex flex-col justify-between relative overflow-hidden border-r border-[#F7DDE4]">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#C44569]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 text-2xl font-serif font-bold text-[#681F3B]">
              <span className="w-8 h-8 rounded-full bg-[#C44569] text-white flex items-center justify-center text-sm shadow-sm">♥</span>
              <span>Just<span className="font-sans font-light italic text-[#C44569]">Us</span></span>
            </Link>
            <p className="text-[11px] text-[#75676E] tracking-widest font-semibold mt-1 uppercase">
              Music • Videos • Your Space
            </p>
          </div>
          <div className="my-8 relative z-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-serif text-[#681F3B] leading-snug">
              Good Music & <br />
              <span className="italic text-[#C44569]">Moments Bring People</span> <br />
              Together <span className="text-[#C44569]">♡</span>
            </h2>
            <div className="mt-6 mx-auto w-48 h-48 rounded-3xl bg-white p-3 shadow-xl border border-white/60 relative overflow-hidden group">
              <CoupleImage folder="music" alt="Aesthetic headphone music couple visual" className="w-full h-full rounded-2xl object-cover" aspect="1/1" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#C44569]/30 to-transparent pointer-events-none" />
            </div>
          </div>
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
            <div className="flex justify-start mb-6">
              <Link to="/" className="text-xs font-semibold text-[#75676E] hover:text-[#C44569] flex items-center gap-1.5 transition-colors">
                <span>←</span> Back to Home
              </Link>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#681F3B]">
                Sign <span className="text-[#C44569]">Up</span>
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-[#75676E]">
                Create your account and start your private couple space journey.
              </p>
            </div>
            {successMessage && (
              <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold animate-fadeIn">
                🎉 {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-[#C44569] text-xs font-semibold animate-fadeIn flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
              <div>
                <label className="block font-semibold text-[#681F3B] mb-1">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#75676E] text-sm">✉️</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    required
                    placeholder="Enter your email address"
                    className={`w-full p-3 pl-10 rounded-2xl border text-sm focus:outline-none bg-[#FFF9F7] ${
                      emailTouched && email && !isValidEmail
                        ? 'border-rose-400 focus:border-rose-500'
                        : 'border-[#F7DDE4] focus:border-[#C44569]'
                    }`}
                  />
                </div>
                {emailTouched && email && !isValidEmail && (
                  <p className="text-rose-600 text-[11px] font-semibold mt-1 flex items-center gap-1">
                    <span>⚠️</span> Please enter a valid email address format (e.g. user@gmail.com).
                  </p>
                )}
              </div>
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
              <button
                type="submit"
                disabled={loading || !isValidEmail || !isMinLength}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#C44569] via-[#D85078] to-[#9E3155] text-white font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{loading ? 'Validating Email & Sending OTP...' : 'Sign Up'}</span>
                <span>→</span>
              </button>
              <div className="relative text-center my-4">
                <div className="divider"><span>or</span></div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFullName('User')
                  setEmail('testuser@gmail.com')
                  setPassword('Password123!')
                  setConfirmPassword('Password123!')
                }}
                className="w-full py-3 rounded-full border border-[#EADDE2] bg-white hover:bg-[#FFF9F7] text-xs font-semibold text-[#2B2025] flex items-center justify-center gap-2 transition-colors"
              >
                <span>🌐</span>
                <span>Continue with Google</span>
              </button>
            </form>
          </div>
          <div className="mt-6 text-center text-xs text-[#75676E]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#C44569] font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
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
                {otpLoading ? 'Verifying OTP...' : 'Verify OTP & Create Space ❤️'}
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
                className="text-[#C44569] font-bold hover:underline"
              >
                Resend OTP Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
