const express = require('express')
const router = express.Router()
const { suggestDates } = require('../controllers/aiController')
const { protectRoute } = require('../middleware/authMiddleware')

router.post('/suggest-dates', protectRoute, suggestDates)

module.exports = router
