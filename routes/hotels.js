const express = require('express')
const router = express.Router()
const { getAllHotels,getHotel, getOneHotel, createHotel, getHotelPrice, updateHotel, deleteHotel, getHotelByAgency, addRatingsHotel, claculateAverageRating,  } = require("../controllers/hotels")
const checkAuth = require('../middlewares/check-auth')


router.get('/', getAllHotels)
// router.get('/country', getHotel)
router.get('/price', getHotelPrice)
router.get('/:id', checkAuth, getOneHotel)
router.get('/hotel-by-page/:id', checkAuth,getHotelByAgency)
router.post('/create-hotel/:pageId',checkAuth, createHotel)
router.put('/:id',checkAuth, updateHotel)
router.delete('/:id',checkAuth, deleteHotel)
router.put('/add-rating-hotel/:id', checkAuth, addRatingsHotel);
router.get('/rating/average-rate',claculateAverageRating)

module.exports = router