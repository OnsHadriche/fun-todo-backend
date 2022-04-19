const Event = require("../models/Event");
const { eventValidator } = require("../utilities/validators");
//get all Events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate({path: 'page', model: 'PageEntreprise', select:'title'});
    res.status(201).json({ events });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//find Events by country
const getEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ country: req.body.country });
    res.status(201).json({ Event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//find Events by price
const getEventPrice = async (req, res) => {
  try {
    const eventByPrice = await Event.aggregate([
      {
        $bucket: {
          // Bucket by price
          groupBy: '$price',
          // With 4 price ranges: [0, 250), [250, 500), [500, 1000),[1000,2000), [2000,5000]
          boundaries: [0, 250, 500, 1000,2000,50000],
          default: 'Others',
          output : {
            "count": { $sum: 1 },
            "titles": { $push: "$title" }
          }
        }
      }
    ])
    const price = req.body.price
    const titleOfEvent = eventByPrice.find(e => e._id === price)
    
    res.status(201).json({eventByPrice, titleOfEvent});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getOneEvent = async (req, res) => {
  try {
    const { id } = req.params.id;
    const event = await Event.findById(id).populate({path: 'page', model: 'PageEntreprise', select:'title'});
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const createEvent = async (req, res) => {
  try {
    const validationResult = eventValidator.validate(req.body, {
      abortEarly: false,
    });
    if (validationResult.error) {
      res.status(400).json(validationResult);
    } else {
      const { photo, title, price, country, details } = req.body;
      const event= new Event({
        photo: photo,
        title: title,
        price: price,
        country: country,
        details: details,
        page : req.params.pageId 
      });
      savedEvent.page = page
      let savedevent = await event.save();
      console.log(savedPack);
      res.status(201).json({
        message: "Event created successfully",
        pack: savedPack,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateEvent = async (req, res) => {
  try {
    const eventToUpdateId = req.params.id;
    const validationResult = eventValidator.validate(req.body, {
      abortEarly: false,
    });
    if (validationResult.error) {
      return res.status(400).json(validationResult);
    }
    const event = await Event.findByIdAndUpdate(
      { _id: eventToUpdateId },
      { $set: req.body },
      { new: true }
    );
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    } else {
      res
        .status(201)
        .json({ message: "Event uptdated successfully", event });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const deletePack = await Event.findByIdAndRemove(eventId);
    if (!deletePack) {
      return res.status(404).json({ error: "Event not founded" });
    }
    res.status(201).json({ message: "the event is deleted succssfully " });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllEvents,
  getEvent,
  getOneEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventPrice,
};