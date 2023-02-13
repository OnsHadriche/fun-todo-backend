const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  image: {
    type: String,
  },
  firstName: {
    type: String,
    required:true
  },

  lastName: {
    type: String,
    required:true
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
  cloudinary_id: {
    type: String
  }

});

module.exports = mongoose.model("User", userSchema);

// // listFavoriteHotel: [
// //   {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: "Hotel",
// //   },
// // ],
// listFavoritePack: [
//   {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Package",
//   },
// ],
// listFavoriteEvent: [
//   {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Event",
//   },
// ],
// listFavoriteAgence: [
//   {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "PageEntreprise",
//   },
// ],
// listUser: [
//   {

//     vistedPack: [
//       {
//         id: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Package",
//         },
//         note: {
//           type: Number,
//           default: 0,
//         },
//         favorite: {
//           type: Boolean,
//           default: false,
//         },
//       },
//     ],
//     vistedAgency: [
//       {
//         id: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "PageEntreprise",
//         },
//         note: {
//           type: Number,
//           default: 0,
//         },
//         favorite: {
//           type: Boolean,
//           default: false,
//         },
//       },
//     ],
//     visitedEvent: [
//       {
//         id: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Event",
//         },
//         note: {
//           type: Number,
//           default: 0,
//         },
//         favorite: {
//           type: Boolean,
//           default: false,
//         },
//       },
//     ],
//   },
// ],
