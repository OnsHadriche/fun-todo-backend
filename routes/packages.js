const express = require('express')
const router = express.Router()
const { getAllPackages,getPackage, getOnePackage, createPackage, updatePackage,deletePackage, getPackagePrice, getPackageByPage } = require("../controllers/packages")
const checkAuth = require('../middlewares/check-auth')
const multerFileUploadCloud =require("../middlewares/multer-fileUpload/cloudinary")


router.get('/', getAllPackages)
router.get('/country', getPackage)
router.get('/price', getPackagePrice)
router.get('/:id', checkAuth, getOnePackage)
router.get('/pack-created-page/:id',checkAuth, getPackageByPage)
router.post('/create-package/:pageId',multerFileUploadCloud, checkAuth, createPackage)
router.put('/:id',checkAuth,multerFileUploadCloud, updatePackage)
router.delete('/:id',checkAuth, deletePackage)

module.exports = router




 