
const Package = require("../models/Package");
const { packageValidator } = require("../utilities/validators");
//get all packages
const getAllPackages = async (req, res) => {
  try {
    const package = await Package.find().populate({path: 'page', model: 'PageEntreprise', select:'title'});
    res.status(201).json({ package });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//find packages by country
const getPackage = async (req, res) => {
  try {
    const packages = await Package.findOne({ country: req.body.country });
    res.status(201).json({ packages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//find packages by price
const getPackagePrice = async (req, res) => {
  try {
    const packByPrice = await Package.aggregate([
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
    const titlePack = packByPrice.find(e => e._id === price)
    
    res.status(201).json({packByPrice, titlePack});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getOnePackage = async (req, res) => {
  try {
    const { id } = req.params.id;
    const package = await Package.findById(id).populate({path: 'page', model: 'PageEntreprise', select:'title'});
    if (!package) {
      return res.status(404).json({ error: "Package not found" });
    }
    res.status(200).json(package);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const createPackage = async (req, res) => {
  try {
    const validationResult = packageValidator.validate(req.body, {
      abortEarly: false,
    });
    if (validationResult.error) {
      res.status(400).json(validationResult);
    } else {
      const { photo, title, price, country, details,expiredAt} = req.body;
      let time = new Date(expiredAt)
  
      const pack = new Package({
        photo: photo,
        title: title,
        price: price,
        country: country,
        details: details,
        createAt: req.params.createAt,
        expiredAt: time,
        page : req.params.pageId 
      });
      let savedPack = await pack.save();
      console.log(savedPack);
      res.status(201).json({
        message: "Package created successfully",
        pack: savedPack,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updatePackage = async (req, res) => {
  try {
    const packageToUpdateId = req.params.id;
    const validationResult = packageValidator.validate(req.body, {
      abortEarly: false,
    });
    if (validationResult.error) {
      return res.status(400).json(validationResult);
    }
    const package = await Package.findByIdAndUpdate(
      { _id: packageToUpdateId },
      { $set: req.body },
      { new: true }
    );
    if (!package) {
      return res.status(404).json({ error: "Package not found" });
    } else {
      res
        .status(201)
        .json({ message: "Package uptdated successfully", package });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deletePackage = async (req, res) => {
  try {
    const packId = req.params.id;
    const deletePack = await Package.findByIdAndRemove(packId);
    if (!deletePack) {
      return res.status(404).json({ error: "package not founded" });
    }
    res.status(201).json({ message: "the package is deleted succssfully " });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllPackages,
  getPackage,
  getOnePackage,
  createPackage,
  updatePackage,
  deletePackage,
  getPackagePrice,
};
