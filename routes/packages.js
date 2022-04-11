const express = require('express')
const router = express.Router()
const { getAllPackages,getPackages, getOnePackage, createPackage, updatePackage } = require("../controllers/packages")


router.get('/', getAllPackages)
router.get('/country', getPackages)
router.get('/:id', getOnePackage)
router.post('/', createPackage)
router.put('/:id', updatePackage)

module.exports = router




 