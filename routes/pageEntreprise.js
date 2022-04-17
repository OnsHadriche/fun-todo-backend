const express = require('express')
const { creatPageEntreprise, addNewAdmin, getPageEntreprise } = require('../controllers/pageEntreprise')
const checkAuth = require('../middlewares/check-auth')
const checkUser = require('../middlewares/check-user')
const router = express.Router()

router.get('/:id', getPageEntreprise)
router.post('/', checkAuth,creatPageEntreprise)
router.put('/:id',checkAuth,addNewAdmin)
 module.exports = router