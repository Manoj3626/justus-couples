const express = require('express')
const router = express.Router()
const { getNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationsController')
const { protectRoute } = require('../middleware/authMiddleware')

router.get('/', protectRoute, getNotifications)
router.put('/read-all', protectRoute, markAllAsRead)
router.put('/:id/read', protectRoute, markAsRead)

module.exports = router
