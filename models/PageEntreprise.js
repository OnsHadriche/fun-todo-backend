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
  },
  photos: [{
    type:String
  }],
  contact: {
    type: Number,
    required: true,
  },
  master: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  admins: [{
     type: mongoose.Schema.Types.ObjectId, 
     ref: "User" 
    }],
});
module.exports = mongoose.model("PageEntreprise", pageSchema);
