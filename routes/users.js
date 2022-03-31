const express = require('express')
const router = express.Router()
const {register, login,getAllUsers, forgetPassword} = require('../controllers/users')

router.get('/allUsers',getAllUsers)
router.post('/register', register)
router.post('/login', login)
router.post('/forget_password',forgetPassword)
// router.put('/password_reset', passwordReset)
module.exports = router