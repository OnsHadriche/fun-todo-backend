const express = require('express')
const { getAllCategories, getCategoryById, createCategory } = require('../controllers/categories')
const router = express.Router()



router.get ('/', getAllCategories)
router.get('/:categoryId', getCategoryById)
router.post('/', createCategory )

module.exports = router