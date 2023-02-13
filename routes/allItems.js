const express = require('express')
const { getAllItems } = require('../controllers/allItems')
const router = express.Router()


router.get('/', getAllItems)
module.exports = router