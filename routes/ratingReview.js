const express = require('express')
const { getReviewByUser } = require('../controllers/ratingReview')
const checkAuth = require('../middlewares/check-auth')

const router = express.Router()

router.get('/:id', checkAuth,getReviewByUser)
module.exports = router