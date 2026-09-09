const express = require('express')
const router = express.Router()
const { createCode, connectSpace, disconnectSpace } = require('../controllers/spaceController')
const { protectRoute } = require('../middleware/authMiddleware')

router.get('/code', protectRoute, createCode)
router.post('/connect', protectRoute, connectSpace)
router.post('/disconnect', protectRoute, disconnectSpace)

module.exports = router
