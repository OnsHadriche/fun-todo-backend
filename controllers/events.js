const Event = require("../models/Event");
const PageEntreprise = require("../models/PageEntreprise");
const User = require("../models/User");
const { eventValidator } = require("../utilities/validators");
const path = require("path");

const cloudinary = require("../utilities/cloudinary");
//get all Events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate([
      { path: "user", model: "User", select: "firstName lastName" },
      { path: "page", model: "PageEntreprise", select: "title" },
      { path: "category", model: "Category", select: "name" },
    ]);

    res.status(201).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//find Events by country
// const getEvent = async (req, res) => {
//   try {
//     const event = await Event.findOne({ country: req.body.country});
//     res.status(201).json( event );
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
//find Events by price
const getEventPrice = async (req, res) => {
  try {
    const eventByPrice = await Event.aggregate([
      {
        $bucket: {
          // Bucket by price
          groupBy: "$price",
          // With 4 price ranges: [0, 250), [250, 500)
          boundaries: [0, 250, 500],
          default: "Others",
          output: {
            count: { $sum: 1 },
            titles: { $push: "$title" },
          },
        },
      },
    ]);
    const price = req.body.price;
    const titleOfEvent = eventByPrice.find((e) => e._id === price);

    res.status(201).json({ eventByPrice, titleOfEvent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getOneEvent = async (req, res) => {
  try {
    const EventId = req.params.id;
    const event = await Event.findById(EventId).populate("page", "title");
    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getEventByPage = async (req, res) => {
  try {
    const id = req.params.id;

    const pageToFind = await PageEntreprise.findById(id);
    if (pageToFind) {
      const eventByPage = await Event.find({ page: id });
      res.status(201).json(eventByPage);
      return;
    }

    const eventByPage = await Event.find({ user: id });
    res.status(201).json(eventByPage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const createEvent = async (req, res) => {
  console.log(req.file);

  try {
    const validationResult = eventValidator.validate(req.body, {
      abortEarly: false,
    });
    if (validationResult.error) {
      res.status(400).json(validationResult);
    } else {
      const { title, price, country, details, category, expiredAt } = req.body;
      console.log(req.body);

      const result = await cloudinary.uploader.upload(req.file.path);

      const event = new Event({
        image: result.secure_url,
        title,
        price,
        country,
        details,
        category,
        expiredAt,
        page: req.params.id,
        user: req.user.id,
        cloudinary_id: result.public_id,
      });

      let savedEvent = await event.save();
      req.user.password = undefined;
      req.user.__v = undefined;
      savedEvent.user = req.user;
      console.log(savedEvent);
      res.status(201).json({
        message: "Event created successfully",
        event: savedEvent,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateEvent = async (req, res) => {
  console.log(req.file)

  try {
    const eventToUpdateId = req.params.id;
    const validationResult = eventValidator.validate(req.body, {
      abortEarly: false,
    });
    if (validationResult.error) {
      return res.status(400).json(validationResult);
    }
    let eventToUpdate = await Event.findById(eventToUpdateId);
    let eventImage = eventToUpdate.image;
    let eventImageCloudId = eventToUpdate.cloudinary_id;

    if (req.file) {
      await cloudinary.uploader.destroy(eventToUpdate.cloudinary_id);
      result = await cloudinary.uploader.upload(req.file.path);
      eventImage = result.secure_url;
      eventImageCloudId = result.public_id;
    }
    const { title, price, country, details, category, expiredAt } = req.body;

    const data = {
      image: eventImage,
      title,
      price,
      country,
      details,
      category,
      expiredAt,
      cloudinary_id: eventImageCloudId,
    };
    const event = await Event.findOneAndUpdate(
      { _id: eventToUpdateId, user: req.user._id },
      data,
      { new: true }
    );
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    } else {
      res.status(201).json({ message: "Event uptdated successfully", event });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const result = await Event.deleteOne({ _id: eventId, user: req.user._id });
    if (result.deletedCount === 1) {
      res.status(201).json({ message: "Event deleted succssfully " });
    } else {
      res.status(404).json({ error: "Event not founded" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllEvents,
  // getEvent,
  getOneEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventPrice,
  getEventByPage,
};
