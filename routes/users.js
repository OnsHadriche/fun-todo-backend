const express = require('express')
const router = express.Router()
const {register, login,getAllUsers, forgetPassword, resetPassword, updateUserInfo,getUserInfo} = require('../controllers/users')
const checkAuth = require('../middlewares/check-auth')
const checkLink = require('../middlewares/checkLink')

router.get('/allUsers',getAllUsers)
router.get('/myprofile',checkAuth,getUserInfo)
router.post('/register', register)
router.post('/login', login)
router.put('/user-profile',checkAuth, updateUserInfo)
router.post('/forget_password',forgetPassword)
router.put('/reset/:id/:token',checkLink,resetPassword)


module.exports = router