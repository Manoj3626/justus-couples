const { validationResult } = require('express-validator')
const User = require('../models/User')
const Otp = require('../models/Otp')
const Connection = require('../models/Connection')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { generateOtp, sendOtpEmail } = require('../services/emailService')

// 1. Signup Account Creation
exports.signup = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { firstName, email, password, confirmPassword } = req.body

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match!' })
  }

  try {
    const trimmedEmail = email.trim().toLowerCase()
    const existing = await User.findOne({ email: trimmedEmail })
    if (existing) {
      return res.status(400).json({ message: 'An account already exists with this email address.' })
    }

    const hash = await bcrypt.hash(password, 10)
    const initialCode = `JUSTUS-${Math.floor(1000 + Math.random() * 9000)}`

    const newUser = new User({
      firstName: firstName.trim() || 'User',
      email: trimmedEmail,
      password: hash,
      connectionCode: initialCode,
      isVerified: false,
    })

    await newUser.save()

    return res.json({
      message: 'Account created successfully! Please sign in with your email and password.',
      email: newUser.email,
    })
  } catch (err) {
    console.error('Signup error:', err)
    return res.status(500).json({ message: 'Server error during account creation.' })
  }
}

// 2. Login Step 1: Credentials Check & Send Email OTP
exports.login = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, password } = req.body

  try {
    const trimmedEmail = email.trim().toLowerCase()
    const user = await User.findOne({ email: trimmedEmail })
    if (!user) {
      return res.status(400).json({ message: 'No account found with this email!' })
    }

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      return res.status(400).json({ message: 'Incorrect password! Please check your credentials.' })
    }

    // Check resend cooldown (30 seconds)
    const latestOtp = await Otp.findOne({ email: trimmedEmail }).sort({ createdAt: -1 })
    if (latestOtp && latestOtp.resendCooldown && new Date() < new Date(latestOtp.resendCooldown)) {
      const waitSeconds = Math.ceil((new Date(latestOtp.resendCooldown) - new Date()) / 1000)
      return res.status(429).json({ message: `Please wait ${waitSeconds}s before requesting a new OTP.` })
    }

    // Generate 6-digit OTP
    const rawOtp = generateOtp()
    const otpHash = await bcrypt.hash(rawOtp, 10)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 mins expiration
    const resendCooldown = new Date(Date.now() + 30 * 1000) // 30s cooldown

    await Otp.create({
      email: trimmedEmail,
      otpHash,
      expiresAt,
      used: false,
      resendCooldown,
    })

    // Send Email OTP
    await sendOtpEmail(trimmedEmail, rawOtp)

    return res.json({
      requiresOtp: true,
      email: trimmedEmail,
      message: 'A 6-digit OTP code has been sent to your email address.',
    })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ message: 'Server error during login.' })
  }
}

// 3. Login Step 2: Verify Email OTP & Issue Session Token
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and 6-digit OTP are required.' })
  }

  try {
    const trimmedEmail = email.trim().toLowerCase()
    const cleanOtp = otp.trim()

    const otpRecord = await Otp.findOne({ email: trimmedEmail, used: false }).sort({ createdAt: -1 })

    if (!otpRecord) {
      return res.status(400).json({ message: 'No active OTP found. Please request a new code.' })
    }

    if (new Date() > new Date(otpRecord.expiresAt)) {
      return res.status(400).json({ message: 'OTP has expired! Please request a new code.' })
    }

    const isMatch = await bcrypt.compare(cleanOtp, otpRecord.otpHash)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid 6-digit OTP code. Please try again.' })
    }

    // Mark OTP as single-use completed
    otpRecord.used = true
    await otpRecord.save()

    // Find User
    const user = await User.findOne({ email: trimmedEmail })
    if (!user) {
      return res.status(404).json({ message: 'User account not found.' })
    }

    user.isVerified = true
    await user.save()

    // Issue JWT Token
    const secret = process.env.JWT_SECRET || 'dev_jwt_secret_change_me'
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '30d' })

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    }
    res.cookie('justus_token', token, cookieOptions)

    // Check space connection
    let spaceConnection = { connected: false, code: user.connectionCode, partnerName: null }
    if (user.connectionId) {
      const conn = await Connection.findById(user.connectionId).populate('user1 user2')
      if (conn && conn.status === 'CONNECTED') {
        const partner = conn.user1._id.equals(user._id) ? conn.user2 : conn.user1
        spaceConnection = {
          connected: true,
          code: conn.code,
          partnerName: partner ? partner.firstName : 'Partner',
          partnerEmail: partner ? partner.email : null,
          connectedAt: conn.connectedAt,
        }
      }
    }

    return res.json({
      token,
      message: 'Welcome to JustUs ❤️',
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        connectionCode: user.connectionCode,
      },
      spaceConnection,
    })
  } catch (err) {
    console.error('Verify OTP error:', err)
    return res.status(500).json({ message: 'Server error during OTP verification.' })
  }
}

// 4. Resend Email OTP
exports.resendOtp = async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ message: 'Email address is required.' })

  try {
    const trimmedEmail = email.trim().toLowerCase()
    const user = await User.findOne({ email: trimmedEmail })
    if (!user) return res.status(400).json({ message: 'Account not found.' })

    const latestOtp = await Otp.findOne({ email: trimmedEmail }).sort({ createdAt: -1 })
    if (latestOtp && latestOtp.resendCooldown && new Date() < new Date(latestOtp.resendCooldown)) {
      const waitSeconds = Math.ceil((new Date(latestOtp.resendCooldown) - new Date()) / 1000)
      return res.status(429).json({ message: `Please wait ${waitSeconds}s before requesting a new OTP.` })
    }

    const rawOtp = generateOtp()
    const otpHash = await bcrypt.hash(rawOtp, 10)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)
    const resendCooldown = new Date(Date.now() + 30 * 1000)

    await Otp.create({
      email: trimmedEmail,
      otpHash,
      expiresAt,
      used: false,
      resendCooldown,
    })

    await sendOtpEmail(trimmedEmail, rawOtp)

    return res.json({ message: 'New 6-digit OTP code sent to your email address.' })
  } catch (err) {
    console.error('Resend OTP error:', err)
    return res.status(500).json({ message: 'Server error during OTP resend.' })
  }
}

// 5. Logout Session
exports.logout = async (req, res) => {
  res.clearCookie('justus_token')
  return res.json({ message: 'Logged out successfully.' })
}

exports.me = async (req, res) => {
  try {
    let user = req.user
    let spaceConnection = { connected: false, code: user.connectionCode, partnerName: null }

    let connId = user.connectionId
    if (!connId) {
      const conn = await Connection.findOne({
        $or: [{ user1: user._id }, { user2: user._id }],
        status: 'CONNECTED',
      })
      if (conn) {
        connId = conn._id
        user.connectionId = conn._id
        user.partnerId = conn.user1.equals(user._id) ? conn.user2 : conn.user1
        await user.save().catch(() => null)
      }
    }

    if (connId) {
      const conn = await Connection.findById(connId).populate('user1 user2')
      if (conn && conn.status === 'CONNECTED') {
        const partner = conn.user1._id.equals(user._id) ? conn.user2 : conn.user1
        spaceConnection = {
          connected: true,
          code: conn.code,
          partnerName: partner ? partner.firstName : 'Partner',
          partnerEmail: partner ? partner.email : null,
          connectedAt: conn.connectedAt,
        }
      }
    }

    return res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        connectionCode: user.connectionCode,
        connectionId: connId,
      },
      spaceConnection,
    })
  } catch (err) {
    return res.status(500).json({ message: 'Server error fetching user session.' })
  }
}

// Dev Direct Login (for automated test verification)
exports.devLogin = async (req, res) => {
  const { email } = req.body || {}
  if (!email) return res.status(400).json({ message: 'Email address is required.' })
  try {
    const trimmedEmail = email.trim().toLowerCase()
    let user = await User.findOne({ email: trimmedEmail })
    if (!user) {
      user = new User({
        firstName: trimmedEmail.split('@')[0],
        email: trimmedEmail,
        password: '$2a$10$devPasswordHashPlaceholderForQuickTestingOnly',
        connectionCode: 'JUSTUS-5977',
        isVerified: true,
      })
      await user.save()
    }

    const secret = process.env.JWT_SECRET || 'dev_jwt_secret_change_me'
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '7d' })

    res.cookie('justus_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.json({ token, user })
  } catch (err) {
    console.error('Dev login error:', err)
    return res.status(500).json({ message: 'Dev login error: ' + err.message })
  }
}

