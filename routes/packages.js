const express = require('express')
const router = express.Router()
const { getAllPackages,getPackages, getOnePackage, createPackage, updatePackage,deletePackage } = require("../controllers/packages")
const checkAuth = require('../middlewares/check-auth')


router.get('/', getAllPackages)
router.get('/country', getPackages)
router.get('/:id', checkAuth, getOnePackage)
router.post('/create-package',checkAuth, createPackage)
router.put('/:id',checkAuth, updatePackage)
router.delete('/:id',checkAuth, deletePackage)

module.exports = router




 