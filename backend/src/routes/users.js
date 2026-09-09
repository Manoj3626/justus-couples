const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { me } = require('../controllers/usersController')

router.get('/me', auth, me)

module.exports = router
