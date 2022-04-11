const Package = require("../models/Package");
const { packageValidator } = require("../utilities/validators");
//get all packages
const getAllPackages = async (req, res) => {
  try {
    const package = await Package.find();
    res.status(201).json({ package });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//find packages by country
const getPackages = async (req, res) => {
  try {
    const packages = await Package.findOne({ country: req.body.country });
    res.status(201).json({ packages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getOnePackage = async (req, res) => {
  try {
    const { id } = req.params.id;
    const package = await Package.findById(id);
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
    }
    const { photo, title, price, details, country } = req.body;
    await new Package({
      photo: photo,
      title: title,
      price: price,
      details: details,
      country: country,
    }).save();
    res.status(201).json({ message: "Package created successfully" });
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

module.exports = {
  getAllPackages,
  getPackages,
  getOnePackage,
  createPackage,
  updatePackage,
};
