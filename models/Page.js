const mongoose = require("mongoose");

const pageSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  photo: {
    type: String,
    default:''
  },
  contact: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
module.exports = mongoose.model("Page", pageSchema);
