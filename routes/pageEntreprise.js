const express = require('express')
const { creatPageEntreprise } = require('../controllers/pageEntreprise')
const router = express.Router()

router.post('/', creatPageEntreprise)