const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  image: {
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
    type : String,
    required: true,
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
  cloudinary_id: {
    type: String
  }
});
module.exports = mongoose.model("Event", eventSchema);
