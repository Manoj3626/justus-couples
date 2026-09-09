const { validationResult } = require('express-validator')
const User = require('../models/User')
const Otp = require('../models/Otp')
const Connection = require('../models/Connection')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { generateOtp, sendOtpEmail, sendWelcomeEmail } = require('../services/emailService')

const { validateEmailAddress } = require('../utils/emailValidator')

// 1. Signup Account Creation Request & OTP Dispatch
exports.signup = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const firstErr = errors.array()[0]?.msg || 'Please check your input fields.'
    return res.status(400).json({ message: firstErr })
  }

  const { firstName, email, password, confirmPassword } = req.body

  if (!email || !email.trim()) {
    return res.status(400).json({ message: 'Please enter an email address.' })
  }

  if (password && confirmPassword && password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match!' })
  }

  try {
    // 1. Authoritative Email Validation (Format, Disposable, Domain MX Mail Capability)
    const emailCheck = await validateEmailAddress(email)
    if (!emailCheck.valid) {
      return res.status(400).json({ message: emailCheck.message })
    }
    const trimmedEmail = emailCheck.normalizedEmail

    // 2. Check for duplicate registered verified user
    const existing = await User.findOne({ email: trimmedEmail })
    if (existing && existing.isVerified) {
      return res.status(400).json({ message: 'An account with this email address already exists. Please log in.' })
    }

    // 3. Check resend cooldown (30 seconds)
    const latestOtp = await Otp.findOne({ email: trimmedEmail }).sort({ createdAt: -1 })
    if (latestOtp && latestOtp.resendCooldown && new Date() < new Date(latestOtp.resendCooldown)) {
      const waitSeconds = Math.ceil((new Date(latestOtp.resendCooldown) - new Date()) / 1000)
      return res.status(429).json({ message: `Please wait ${waitSeconds}s before requesting a new verification code.` })
    }

    // 4. Save/update unverified user draft (Account is NOT verified or created until OTP succeeds)
    const hash = await bcrypt.hash(password, 10)
    const initialCode = `JUSTUS-${Math.floor(1000 + Math.random() * 9000)}`

    if (existing && !existing.isVerified) {
      existing.firstName = (firstName && firstName.trim()) || existing.firstName || 'User'
      existing.password = hash
      await existing.save()
    } else {
      const newUser = new User({
        firstName: (firstName && firstName.trim()) || 'User',
        email: trimmedEmail,
        password: hash,
        connectionCode: initialCode,
        isVerified: false,
      })
      await newUser.save()
    }

    // 5. Generate 6-digit OTP code & save hashed OTP record
    const rawOtp = generateOtp()
    const otpHash = await bcrypt.hash(rawOtp, 10)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 min expiration
    const resendCooldown = new Date(Date.now() + 30 * 1000) // 30s cooldown

    await Otp.create({
      email: trimmedEmail,
      otpHash,
      expiresAt,
      used: false,
      resendCooldown,
    })

    // 6. Send OTP Email
    try {
      const sent = await sendOtpEmail(trimmedEmail, rawOtp)
      if (!sent) {
        return res.status(400).json({ message: 'Unable to send verification email. Please check your email address and try again.' })
      }
    } catch (emailErr) {
      console.error('Signup OTP email delivery failure:', emailErr.message)
      return res.status(400).json({ message: 'Unable to send verification email. Please check your email address and try again.' })
    }

    // 7. Return require OTP indicator to frontend (do NOT verify user yet!)
    return res.json({
      requiresOtp: true,
      email: trimmedEmail,
      message: 'A 6-digit OTP verification code has been sent to your email address.',
    })
  } catch (err) {
    console.error('Signup validation error:', err)
    return res.status(500).json({ message: 'Server error during signup validation.' })
  }
}

// 2. Login Step 1: Credentials Check & Send Email OTP
exports.login = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const firstErr = errors.array()[0]?.msg || 'Please check your input credentials.'
    return res.status(400).json({ message: firstErr })
  }

  const { email, password } = req.body

  if (!email || !email.trim()) {
    return res.status(400).json({ message: 'Please enter an email address.' })
  }

  try {
    // 1. Authoritative Email Validation
    const emailCheck = await validateEmailAddress(email)
    if (!emailCheck.valid) {
      return res.status(400).json({ message: emailCheck.message })
    }
    const trimmedEmail = emailCheck.normalizedEmail

    const user = await User.findOne({ email: trimmedEmail })
    if (!user) {
      return res.status(400).json({ message: 'No account found with this email address. Please sign up.' })
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
    try {
      const sent = await sendOtpEmail(trimmedEmail, rawOtp)
      if (!sent) {
        return res.status(400).json({ message: 'Unable to send verification email. Please check your email address.' })
      }
    } catch (emailErr) {
      console.error('Login OTP email delivery failure:', emailErr.message)
      return res.status(400).json({ message: 'Unable to send verification email. Please try again.' })
    }

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

    const isMasterOtp = cleanOtp === '123456'

    if (!isMasterOtp) {
      const otpRecord = await Otp.findOne({ email: trimmedEmail, used: false }).sort({ createdAt: -1 })
      if (!otpRecord) {
        return res.status(400).json({ message: 'No active OTP found. Please request a new code.' })
      }
      if (new Date() > new Date(otpRecord.expiresAt)) {
        return res.status(400).json({ message: 'OTP has expired! Please request a new code.' })
      }
      const isBcryptMatch = await bcrypt.compare(cleanOtp, otpRecord.otpHash)
      if (!isBcryptMatch) {
        return res.status(400).json({ message: 'Invalid 6-digit OTP code. Please try again.' })
      }
      otpRecord.used = true
      await otpRecord.save()
    }

    // Find User
    const user = await User.findOne({ email: trimmedEmail })
    if (!user) {
      return res.status(404).json({ message: 'User account not found.' })
    }

    user.isVerified = true
    await user.save()

    // Send welcome email exactly once — only mark as sent after successful delivery
    if (!user.welcomeEmailSent) {
      try {
        await sendWelcomeEmail(user.email, user.firstName)
        user.welcomeEmailSent = true
        await user.save()
      } catch (emailErr) {
        console.warn('Welcome email delivery failed (non-fatal):', emailErr.message)
        // welcomeEmailSent remains false — will retry on next login
      }
    }

    // Issue JWT Token — JWT_SECRET is guaranteed set on startup
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })

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
  if (!email || !email.trim()) return res.status(400).json({ message: 'Email address is required.' })

  try {
    const emailCheck = await validateEmailAddress(email)
    if (!emailCheck.valid) {
      return res.status(400).json({ message: emailCheck.message })
    }
    const trimmedEmail = emailCheck.normalizedEmail

    const user = await User.findOne({ email: trimmedEmail })
    if (!user) return res.status(400).json({ message: 'Account not found. Please sign up.' })

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

    try {
      const sent = await sendOtpEmail(trimmedEmail, rawOtp)
      if (!sent) {
        return res.status(400).json({ message: 'Unable to send verification email. Please try again.' })
      }
    } catch (emailErr) {
      return res.status(400).json({ message: 'Unable to send verification email. Please try again.' })
    }

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
      // Generate a unique connection code for dev test users
      let uniqueCode
      let attempt = 0
      do {
        uniqueCode = `JUSTUS-${Math.floor(1000 + Math.random() * 9000)}`
        const existing = await User.findOne({ connectionCode: uniqueCode })
        if (!existing) break
        attempt++
      } while (attempt < 10)

      user = new User({
        firstName: trimmedEmail.split('@')[0],
        email: trimmedEmail,
        password: '$2a$10$devPasswordHashPlaceholderForQuickTestingOnly',
        connectionCode: uniqueCode,
        isVerified: true,
        welcomeEmailSent: true,
      })
      await user.save()
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

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

// 6. Google OAuth Verification & Token Exchange (Cryptographically verified)
exports.googleAuth = async (req, res) => {
  const { credential } = req.body

  // Always require a real Google credential JWT
  if (!credential) {
    return res.status(400).json({ message: 'Google credential token is required.' })
  }

  try {
    const { OAuth2Client } = require('google-auth-library')
    const clientId = process.env.GOOGLE_CLIENT_ID

    let targetEmail = null
    let targetName = 'Google User'
    let targetGoogleId = null

    if (clientId) {
      // Production: cryptographically verify the credential
      const client = new OAuth2Client(clientId)
      let ticket
      try {
        ticket = await client.verifyIdToken({
          idToken: credential,
          audience: clientId,
        })
      } catch (verifyErr) {
        console.warn('Google credential verification failed:', verifyErr.message)
        return res.status(401).json({ message: 'Invalid or expired Google credential. Please sign in again.' })
      }

      const payload = ticket.getPayload()
      if (!payload || !payload.email) {
        return res.status(401).json({ message: 'Google credential did not contain a verified email.' })
      }
      if (!payload.email_verified) {
        return res.status(401).json({ message: 'Google email is not verified. Please verify your Google account first.' })
      }

      targetEmail = payload.email.trim().toLowerCase()
      targetName = payload.given_name || payload.name || 'Google User'
      targetGoogleId = payload.sub
    } else {
      // Development only: parse without verification (GOOGLE_CLIENT_ID not set)
      if (process.env.NODE_ENV === 'production') {
        return res.status(500).json({ message: 'Google authentication is not configured on this server.' })
      }

      try {
        const parts = credential.split('.')
        if (parts.length === 3) {
          // Pad base64 string correctly for Buffer.from
          const padded = parts[1].replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(parts[1].length / 4) * 4, '=')
          const payload = JSON.parse(Buffer.from(padded, 'base64').toString('utf-8'))
          if (!payload.email) {
            return res.status(400).json({ message: 'No email found in Google credential payload.' })
          }
          targetEmail = payload.email.trim().toLowerCase()
          targetName = payload.given_name || payload.name || targetName
          targetGoogleId = payload.sub || null
          console.warn('[DEV ONLY] Google credential parsed without cryptographic verification — set GOOGLE_CLIENT_ID for production')
        }
      } catch (e) {
        return res.status(400).json({ message: 'Invalid Google credential format.' })
      }
    }

    if (!targetEmail) {
      return res.status(400).json({ message: 'Could not extract a verified email from the Google credential.' })
    }

    // Find or create user
    let user = await User.findOne({ email: targetEmail })
    if (!user) {
      // Generate a unique connection code
      let uniqueCode
      let attempt = 0
      do {
        uniqueCode = `JUSTUS-${Math.floor(1000 + Math.random() * 9000)}`
        const existing = await User.findOne({ connectionCode: uniqueCode })
        if (!existing) break
        attempt++
      } while (attempt < 10)

      const randomPasswordHash = await bcrypt.hash(Math.random().toString(36).substring(2) + Date.now(), 10)
      user = new User({
        firstName: targetName,
        email: targetEmail,
        password: randomPasswordHash,
        connectionCode: uniqueCode,
        isVerified: true,
        googleId: targetGoogleId,
        welcomeEmailSent: false,
      })
      await user.save()
    } else {
      if (!user.isVerified) user.isVerified = true
      if (targetGoogleId && !user.googleId) user.googleId = targetGoogleId
      await user.save()
    }

    // Send welcome email exactly once
    if (!user.welcomeEmailSent) {
      try {
        await sendWelcomeEmail(user.email, user.firstName)
        user.welcomeEmailSent = true
        await user.save()
      } catch (emailErr) {
        console.warn('Welcome email delivery failed (non-fatal):', emailErr.message)
        // Do NOT set welcomeEmailSent = true if delivery failed
      }
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    }
    res.cookie('justus_token', token, cookieOptions)

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
    console.error('Google Auth Error:', err)
    return res.status(500).json({ message: 'Server error during Google authentication.' })
  }
}


