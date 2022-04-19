const express = require('express')
const router = express.Router()
const { getAllEvents, getEvent, getEventPrice, getOneEvent, createEvent, updateEvent, deleteEvent } = require("../controllers/events")
const checkAuth = require('../middlewares/check-auth')


router.get('/', getAllEvents)
router.get('/country', getEvent)
router.get('/price', getEventPrice)
router.get('/:id', checkAuth, getOneEvent)
router.post('/create-event/:pageId',checkAuth, createEvent)
router.put('/:id',checkAuth, updateEvent)
router.delete('/:id',checkAuth, deleteEvent)

module.exports = router