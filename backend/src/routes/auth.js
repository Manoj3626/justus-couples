const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const { signup, login, verifyOtp, resendOtp, logout, me, devLogin } = require('../controllers/authController')
const { protectRoute } = require('../middleware/authMiddleware')

router.post('/dev-login', devLogin)
router.post(
  '/signup',
  [
    body('firstName').notEmpty().withMessage('First Name is required.'),
    body('email').isEmail().withMessage('Please enter a valid email address.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  ],
  signup
)

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email address.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  login
)

router.post('/verify-otp', verifyOtp)
router.post('/resend-otp', resendOtp)
router.post('/logout', logout)
router.get('/me', protectRoute, me)

module.exports = router
