const express= ('express')
const router = express.Router()
const { getAllPackages,getPackages, getOnePackage, createPackage } = require("../controllers/packages")


router.get('/', getAllPackages)
router.get('/country', getPackages)
router.get('/:id', getOnePackage)
router.post('/', createPackage)
router.put('/:id')

module.exports = router




 