const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  photo: {
    type: String,
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
  listFavoriteHotel :[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel'

  }],
  listFavoritePack :[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package'

  }],
  listFavoriteEvent:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'

  }],
  listFavoriteAgence:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PageEntreprise'

  }],
  photos:[{
    type:String
  }]
 
});

module.exports = mongoose.model("User", userSchema);
