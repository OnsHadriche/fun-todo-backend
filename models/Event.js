const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  photo: {
    type: String,
  },
  photos: [
    {
      type: String,
    }
  ],
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
  details: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categories",
    required: false,
  },
  page: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PageEntreprise",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiredAt: {
    type: Date,
  },
});
module.exports = mongoose.model("Event", eventSchema);
