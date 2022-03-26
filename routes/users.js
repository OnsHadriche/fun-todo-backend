const express = require('express')
const router = express.Router()
const {Register, Login} = require('../controllers/users')


router.post('/register', Register)
module.exports = router