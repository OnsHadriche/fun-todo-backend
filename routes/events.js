const express = require('express')
const router = express.Router()
const { getAllEvents, getEvent, getEventPrice, getOneEvent, createEvent, updateEvent, deleteEvent, getEventByPage } = require("../controllers/events")
const checkAuth = require('../middlewares/check-auth')
const multerFileUploadCloud =require("../middlewares/multer-fileUpload/cloudinary")


router.get('/', getAllEvents)
// router.get('/country', getEvent)
router.get('/price', getEventPrice)
router.get('/:id', checkAuth, getOneEvent)
router.get('/events-created/:id', checkAuth, getEventByPage)
// router.post('/create-event/:categoryId/:id',checkAuth, createEvent)
// router.post('/create-event-user/:categoryId',checkAuth, createEvent)
router.post('/create-event/:id',multerFileUploadCloud , checkAuth, createEvent)
router.put('/:id',multerFileUploadCloud,checkAuth, updateEvent)
router.delete('/:id',checkAuth, deleteEvent)

module.exports = router