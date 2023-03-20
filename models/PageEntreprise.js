const mongoose = require("mongoose");

const pageSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  photos: [
    {
      type: String,
    },
  ],
  contact: {
    type: Number,
    required: true,
  },
  country:{
    type:String
  },
  master: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  cloudinary_id: {
    type: String,
  },
});
module.exports = mongoose.model("PageEntreprise", pageSchema);
