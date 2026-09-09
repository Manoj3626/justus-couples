const nodemailer = require('nodemailer')

// Generate random 6-digit numeric OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send OTP email or log to console in dev fallback mode
async function sendOtpEmail(email, otp) {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.SMTP_FROM || '"JustUs ❤️" <noreply@justus.app>'

  if (host && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user, pass },
      })

      await transporter.sendMail({
        from,
        to: email,
        subject: 'JustUs Verification Code 🔐',
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #eadde2; borderRadius: 16px;">
            <h2 style="color: #681F3B;">JustUs Security Code ❤️</h2>
            <p style="color: #75676E;">Your 6-digit login verification OTP is below. It expires in 5 minutes:</p>
            <div style="background-color: #fff1f4; border: 1px solid #f7dde4; border-radius: 12px; padding: 16px; text-align: center; margin: 20px 0;">
              <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #c44569;">${otp}</span>
            </div>
            <p style="font-size: 12px; color: #75676E;">Do not share this code with anyone. If you did not attempt to sign in, please secure your account immediately.</p>
          </div>
        `,
      })
      console.log(`Email OTP sent via SMTP to ${email}`)
      return true
    } catch (err) {
      console.error('SMTP Error:', err.message)
    }
  }

  // Development Fallback Logging
  console.log('\n==================================================')
  console.log(`📧 DEV MODE EMAIL OTP FOR [${email}]: ${otp}`)
  console.log('==================================================\n')
  return true
}

// Send One-time Welcome Email upon initial account verification
async function sendWelcomeEmail(email, firstName) {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.SMTP_FROM || '"JustUs ❤️" <noreply@justus.app>'

  if (host && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user, pass },
      })

      await transporter.sendMail({
        from,
        to: email,
        subject: 'Welcome to JustUs ❤️',
        html: `
          <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #eadde2; border-radius: 16px;">
            <h2 style="color: #681F3B;">Welcome to JustUs, ${firstName}! ❤️</h2>
            <p style="color: #4A3A42; line-height: 1.6;">Your private space is ready. Connect with your partner using your unique connection code to start sharing real-time chat, music, videos, memories, and dates!</p>
            <div style="background-color: #fff1f4; border: 1px solid #f7dde4; border-radius: 12px; padding: 16px; text-align: center; margin: 20px 0;">
              <span style="font-size: 14px; color: #c44569; font-weight: bold;">Two people. One private space.</span>
            </div>
          </div>
        `,
      })
      console.log(`Welcome email sent via SMTP to ${email}`)
      return true
    } catch (err) {
      console.error('SMTP Welcome Email Error:', err.message)
    }
  }

  console.log('\n==================================================')
  console.log(`📧 DEV MODE WELCOME EMAIL FOR [${email}] (${firstName})`)
  console.log('==================================================\n')
  return true
}

module.exports = {
  generateOtp,
  sendOtpEmail,
  sendWelcomeEmail,
}

