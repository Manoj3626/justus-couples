const jwt = require('jsonwebtoken')
const User = require('../models/User')

async function protectRoute(req, res, next) {
  try {
    let token = req.cookies?.justus_token
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, token missing' })
    }

    // JWT_SECRET is guaranteed set by index.js startup (dev gets default, production throws if missing)
    const secret = process.env.JWT_SECRET
    if (!secret) {
      return res.status(500).json({ message: 'Server security configuration error' })
    }
    const decoded = jwt.verify(token, secret)

    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      return res.status(401).json({ message: 'User account not found' })
    }

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' })
  }
}

module.exports = { protectRoute }
