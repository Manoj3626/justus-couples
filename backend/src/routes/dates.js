const express = require('express')
const router = express.Router()
const { getDates, addDate, updateDate, deleteDate } = require('../controllers/datesController')
const { protectRoute } = require('../middleware/authMiddleware')

router.get('/', protectRoute, getDates)
router.post('/', protectRoute, addDate)
router.put('/:id', protectRoute, updateDate)
router.delete('/:id', protectRoute, deleteDate)

module.exports = router
