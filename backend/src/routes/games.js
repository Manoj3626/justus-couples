const express = require('express')
const router = express.Router()
const { getSession, submitAnswer, resetSession } = require('../controllers/gamesController')
const { protectRoute } = require('../middleware/authMiddleware')

router.get('/:gameId', protectRoute, getSession)
router.post('/:gameId/answer', protectRoute, submitAnswer)
router.post('/:gameId/reset', protectRoute, resetSession)

module.exports = router
