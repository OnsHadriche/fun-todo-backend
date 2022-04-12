const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  photo: {
    type: String,
    default:''
  },
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
 
});

module.exports = mongoose.model("User", userSchema);
