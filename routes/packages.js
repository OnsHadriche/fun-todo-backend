const express = require('express')
const router = express.Router()
const { getAllPackages,getPackage, getOnePackage, createPackage, updatePackage,deletePackage, getPackagePrice } = require("../controllers/packages")
const checkAuth = require('../middlewares/check-auth')


router.get('/', getAllPackages)
router.get('/country', getPackage)
router.get('/price', getPackagePrice)
router.get('/:id', checkAuth, getOnePackage)
router.post('/create-package/:pageId',checkAuth, createPackage)
router.put('/:id',checkAuth, updatePackage)
router.delete('/:id',checkAuth, deletePackage)

module.exports = router




 