const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  note: {
    type: Number,
    default:0
  },
  hotel:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Hotel"
  }
});
module.exports = mongoose.model("Review",ReviewSchema )