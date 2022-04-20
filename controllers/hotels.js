const Hotel = require("../models/Hotel");
const { hotelValidator } = require("../utilities/validators");
//get all Hotels
const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find().populate({path: 'page', model: 'PageEntreprise', select:'title'});
    res.status(201).json({ hotels });
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
          groupBy: '$price',
          // With 4 price ranges: [0, 250), [250, 500), [500, 1000),[1000,2000), [2000,5000]
          boundaries: [0, 250, 500, 1000,2000,50000],
          default: 'Others',
          output : {
            "count": { $sum: 1 },
            "titles": { $push: "$title" }
          }
        }
      }
    ])
    const price = req.body.price
    const titleOfHotel = hotelByPrice.find(e => e._id === price)
    
    res.status(201).json({hotelByPrice, titleOfHotel});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getOneHotel = async (req, res) => {
  try {
    const { id } = req.params.id;
    const hotel = await Hotel.findById(id).populate({path: 'page', model: 'PageEntreprise', select:'title'});
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }
    res.status(200).json(hotel);
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
      const { photo, title, price, country, details,chambre } = req.body;
      const hotel= new Hotel({
        photo: photo,
        title: title,
        price: price,
        country: country,
        details: details,
        chambre: chambre,
        page : req.params.pageId 
      });
      let savedHotel = await hotel.save();
      console.log(savedHotel);
      res.status(201).json({
        message: "Hotel created successfully",
        pack: savedHotel,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateHotel = async (req, res) => {
  try {
    const hotelToUpdateId = req.params.id;
    const validationResult = hotelValidator.validate(req.body, {
      abortEarly: false,
    });
    if (validationResult.error) {
      return res.status(400).json(validationResult);
    }
    const hotel = await Hotel.findByIdAndUpdate(
      { _id: hotelToUpdateId },
      { $set: req.body },
      { new: true }
    );
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    } else {
      res
        .status(201)
        .json({ message: "Hotel uptdated successfully", hotel });
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

module.exports = {
  getAllHotels,
  // getHotel,
  getOneHotel,
  createHotel,
  updateHotel,
  deleteHotel,
  getHotelPrice,
};