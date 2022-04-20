const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  photo: {
    type: String,
    default: " ",
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
  details: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categories",
    required:true
  },
  page: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PageEntreprise",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
module.exports = mongoose.model("Event", eventSchema);
