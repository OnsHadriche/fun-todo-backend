const mongoose = require("mongoose");

const hotelSchema = mongoose.Schema({
  image: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  photos: [
    {
      type: String,
    },
  ],
  details: {
    type: String,
  },
  rooms: {
    type: Number,
    required: true,
    min: 0,
    max: 1000,
  },
  rating_avg: {
    type: Number,
    default: 0,
  },
  ratings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  star: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  page: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PageEntreprise",
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  cloudinary_id: {
    type: String,
  },
});
module.exports = mongoose.model("Hotel", hotelSchema);
