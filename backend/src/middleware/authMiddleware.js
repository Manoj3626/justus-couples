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

    const secret = process.env.JWT_SECRET || 'dev_jwt_secret_change_me'
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
