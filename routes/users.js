const express = require('express')
const router = express.Router()
const {register, login,getAllUsers, forgetPassword, resetPassword} = require('../controllers/users')
const checkLink = require('../middlewares/checkLink')

router.get('/allUsers',getAllUsers)
router.post('/register', register)
router.post('/login', login)
router.post('/forget_password',forgetPassword)
router.put('/reset/:id/:token',checkLink,resetPassword)


module.exports = router