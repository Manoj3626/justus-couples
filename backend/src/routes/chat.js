const express = require('express')
const router = express.Router()
const { getMessages, sendMessage } = require('../controllers/chatController')
const { protectRoute } = require('../middleware/authMiddleware')

router.get('/messages', protectRoute, getMessages)
router.post('/messages', protectRoute, sendMessage)

module.exports = router
