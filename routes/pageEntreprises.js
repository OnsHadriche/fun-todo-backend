const express = require('express')

const { creatPageEntreprise, addNewAdmin, getOnePage, removePageEntreprise, removeAdmin, getAllPages } = require('../controllers/pageEntreprises')
const checkAuth = require('../middlewares/check-auth')
const router = express.Router()


router.get('/', getAllPages)
router.get('/:id', getOnePage)


router.post('/create-page', checkAuth,creatPageEntreprise)
router.put('/:id',checkAuth,addNewAdmin)
router.delete('/:id',checkAuth,removePageEntreprise)
router.put('/delete/:id',checkAuth, removeAdmin)
 module.exports = router