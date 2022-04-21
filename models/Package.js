const mongoose = require("mongoose");

const packageSchema = mongoose.Schema({
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
  details: String,
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
});

module.exports = mongoose.model("Package", packageSchema);
