const Hotel = require("../models/Hotel");
const PageEntreprise = require("../models/PageEntreprise");
const Review = require("../models/Review");
const { hotelValidator } = require("../utilities/validators");
const cloudinary = require("../utilities/cloudinary");

//get all Hotels

const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find().populate({
      path: "page",
      model: "PageEntreprise",
      select: ["title", "master"],
    });
    res.status(201).json(hotels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//find Hotels by country
// const getHotel = async (req, res) => {
//   try {
//     const hotel = await Hotel.findOne({ country: req.body.country });
//     res.status(201).json({ hotel });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
//find Hotels by price
const getHotelPrice = async (req, res) => {
  try {
    const hotelByPrice = await Hotel.aggregate([
      {
        $bucket: {
          // Bucket by price
          groupBy: "$price",
          // With 4 price ranges: [0, 250), [250, 500), [500, 1000),[1000,2000), [2000,5000]
          boundaries: [0, 250, 500, 1000, 2000, 50000],
          default: "Others",
          output: {
            count: { $sum: 1 },
            titles: { $push: "$title" },
          },
        },
      },
    ]);
    const price = req.body.price;
    const titleOfHotel = hotelByPrice.find((e) => e._id === price);

    res.status(201).json({ hotelByPrice, titleOfHotel });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getOneHotel = async (req, res) => {
  try {
    const id  = req.params.id;
    const hotel = await Hotel.findById(id);
    const userId = req.user._id;
    const reviewByUser = await Review.findOne({user: userId, hotel:id})


    if (hotel || reviewByUser) {
      return res.status(200).json({hotel:hotel, userReview: reviewByUser});
    
    }else{
      return res.status(404).json({ error: "Hotel not found" });
    }
    
  
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const createHotel = async (req, res) => {
  try {
    const validationResult = hotelValidator.validate(req.body, {
      abortEarly: false,
    });
    if (validationResult.error) {
      res.status(400).json(validationResult);
    } else {
      const { title, price, country, details, rooms } = req.body;
      const result = await cloudinary.uploader.upload(req.file.path);
      
      const hotel = new Hotel({
        image: result.secure_url,
        title: title,
        price: price,
        country: country,
        details: details,
        rooms: rooms,
        page: req.params.pageId,
        cloudinary_id: result.public_id,

      });
      let savedHotel = await hotel.save();
      res.status(201).json({
        message: "Hotel created successfully",
        hotel: savedHotel,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateHotel = async (req, res) => {
  try {
    const hotelToUpdateId = req.params.id;
    // const validationResult = hotelValidator.validate(req.body, {
    //   abortEarly: false,
    // });
    // if (validationResult.error) {
    //   return res.status(400).json(validationResult);
    // }
    let hotelToUpadate = await Hotel.findById(hotelToUpdateId)
    let hotelImage = hotelToUpadate.image
    let hotelImageCloudId = hotelToUpadate.cloudinary_id
    if (req.file) {
      await cloudinary.uploader.destroy(hotelToUpadate.cloudinary_id);
      result = await cloudinary.uploader.upload(req.file.path);
      hotelImage = result.secure_url;
      hotelImageCloudId = result.public_id;
    }
    const { title, price, country, details, rooms } = req.body;
    const data = {
      image: hotelImage,
      title,
      price,
      country,
      details,
      rooms,
      cloudinary_id: hotelImageCloudId
    }
    const hotel = await Hotel.findByIdAndUpdate(
      { _id: hotelToUpdateId },
      data ,
      { new: true }
    );
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    } else {
      res.status(201).json({ message: "Hotel uptdated successfully", hotel });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteHotel = async (req, res) => {
  try {
    const hotelId = req.params.id;
    const deletePack = await Hotel.findByIdAndRemove(hotelId);
    if (!deletePack) {
      return res.status(404).json({ error: "hotel not founded" });
    }
    res.status(201).json({ message: "the hotel is deleted succssfully " });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getHotelByAgency = async (req, res) => {
  try {
    const pageId = req.params.id;
    const hotels = await Hotel.find({ page: pageId });
    res.status(201).json(hotels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// create ratings
// const addRatingsHotel = async (req, res) => {
//   try {
//     const hotelId = req.params.id;
//     const userId = req.user._id;
//     const {note} = req.body
//     let updatedHotel;
//     // const hotelToUpdate = await Hotel.findOneAndUpdate(
//     //   { _id: hotelId, "ratings.id": userId},
//     //   { $set: {"ratings.note": note } },
//     //   { new: true, safe: true, upsert: true }
//     // );
//     const hotelToUpdate = await Hotel.findOne({ _id: hotelId });
//     // const isFound = hotelToUpdate.ratings.find(
//     //   (value) => value._id == userId.toString()
//     // );
//     const isFound = hotelToUpdate.ratings.some(
//       (element) => element._id == userId.toString()
//     );
//     console.log(userId);
//     console.log(hotelToUpdate.ratings);
//     console.log(isFound);
//     if (isFound) {
//       console.log("hello");
//       updatedHotel = await Hotel.findOneAndUpdate(
//         { _id:hotelToUpdate },
//         { $set: { ratings:[{note:note}] } },
//         {upsert:true}
//       );
//     } else {
//       updatedHotel = await Hotel.findOneAndUpdate(
//         { _id: hotelId },
//         { $push: { ratings: [{ _id: userId, note: note }] } },
//         {new:true}
//       );
//     }
//     res.status(201).json(updatedHotel);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
const addRatingsHotel = async (req, res) => {
  try {
    const hotelId = req.params.id;
    const userId = req.user._id;
    const { note } = req.body;
    const isReviewExist = await Review.findOne({
      user: userId,
      hotel: hotelId,
    });
    const hotelExist = await Hotel.findById(hotelId);

    console.log(isReviewExist);
    if (isReviewExist) {
      const userReview = await Review.findOneAndUpdate(
        {
          user: userId,
          hotel: hotelId,
        },
        { $set: { note: note } },
        { new: true }
      );
      return res.status(201).json({ reviews: userReview, hotel: hotelExist });
    } else {
      let savedReview = await new Review({
        user: userId,
        note: note,
        hotel: hotelId,
      }).save();
      console.log(savedReview);
      const updatedHotel = await Hotel.findOneAndUpdate(
        {
          _id: hotelId,
        },
        {
          $addToSet: { ratings: [savedReview] },
        },
        { new: true }
      );
      return res.status(201).json(updatedHotel);
    }

    // const updatedHotel = await Hotel.findOneAndUpdate(
    //   {
    //     _id: hotelId,
    //   },
    //   { $set: { ratings: [userReview] } },
    //   { new: true }
    // );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const claculateAverageRating = async (req, res) => {
  try {
    const allReviews = await Review.find()
    const ratingAverage = await Review.aggregate([{
      $group: {
        _id: "$hotel",
        averageRate:{$avg:"$note"}
      },
    }]);
    res.status(200).json({moyenne:ratingAverage, data :allReviews})
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  getAllHotels,
  // getHotel,
  addRatingsHotel,
  getOneHotel,
  createHotel,
  updateHotel,
  deleteHotel,
  getHotelPrice,
  getHotelByAgency,
  claculateAverageRating
};
