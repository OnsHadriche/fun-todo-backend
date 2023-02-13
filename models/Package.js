const mongoose = require("mongoose");

const packageSchema = mongoose.Schema({
  image: {
    type: String,
  },
  photos: [{
    type:String
  }],
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
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiredAt:{
    type:Date,
    required: true
  },
  page: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PageEntreprise",
  },
  cloudinary_id: {
    type: String
  }
});

module.exports = mongoose.model("Package", packageSchema);
