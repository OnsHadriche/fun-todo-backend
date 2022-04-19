const express = require('express')
const { creatPageEntreprise, addNewAdmin, getPageEntreprise, removePageEntreprise, removeAdmin } = require('../controllers/pageEntreprises')
const checkAuth = require('../middlewares/check-auth')
const router = express.Router()

router.get('/:id', getPageEntreprise)
router.post('/', checkAuth,creatPageEntreprise)
router.put('/:id',checkAuth,addNewAdmin)
router.delete('/:id',checkAuth,removePageEntreprise)
router.put('/delete/:id',checkAuth, removeAdmin)
 module.exports = router