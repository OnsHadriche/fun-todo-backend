const mongoose = require("mongoose");
const PageEntreprise = require("../models/PageEntreprise");
const User = require("../models/User");
const { pageValidator } = require("../utilities/validators");

const creatPageEntreprise = async (req, res) => {
  try {
    const validatorResult = pageValidator.validate(req.body, {
      abortEarly: false,
    });
    if (validatorResult.error) {
      return res.status(400).json(validatorResult);
    }
    const pageEntrepriseTitle = await PageEntreprise.findOne({
      title: req.body.title,
    });
    if (pageEntrepriseTitle) {
      return res
        .status(401)
        .json({ error: "Please enter a valid company title" });
    }
    const { title, description, photo, contact } = req.body;

    const pageEntreprise = await new PageEntreprise({
      title: title,
      description: description,
      photo: photo,
      contact: contact,
      master: req.user.id,
    });
    const savedPage = await pageEntreprise.save();
    req.user.password = undefined;
    req.user.__v = undefined;
    savedPage.master = req.user;
    res.status(201).json({
      message: "Page  created successfully",
      pageEntreprise: savedPage,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const addNewAdmin = async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.body.id)
    const existingUser = await User.findById(userId);
    if (!existingUser ) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    console.log(existingUser)
    const user = {
      firstName: existingUser.firstName,
      lastName : existingUser.lastName,
      _id : userId
    }
    const existingAdmin = await PageEntreprise.findOne({admins:{_id:userId}})
    if(existingAdmin || existingAdmin === req.user.id){
      res.status(401).json({message:'User is already admin'})
      return;
    }
     const pageToUpdate = await PageEntreprise.findOneAndUpdate(
      { master: req.user.id },
      { $push: {
         admins: [user]
        } },
      { new: true }
    );
    res.status(201).json({ message: "New admin added successfully", pageToUpdate});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const removeAdmin = async (req, res) => {
  try {
    const pageId = req.params.id;
    const pageEntreprise = await PageEntreprise.findById(pageId);
    if (!pageEntreprise) {
      res.status(404).json({ error: "Page not founded" });
      return;
    }

   const userId = mongoose.Types.ObjectId(req.body.id)
    const existingUser = await User.findById(userId);
    if (!existingUser ) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    // console.log(existingUser)
    const user = {
      firstName: existingUser.firstName,
      lastName : existingUser.lastName,
      _id : userId
    }
    const existingAdmin = await PageEntreprise.findOne({admins:{_id:userId}})
    if(!existingAdmin){
      res.status(401).json({message:'User is not  admin'})
      return;
    }
    // console.log(user._id)
    const page = await PageEntreprise.findOneAndUpdate(
      { master: req.user.id },
      { $pull: {
         admins: user._id
        } },
      { new: true }
    );
    res.status(201).json({ message: "Admin deleted successfully", page });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getPageEntreprise = async (req, res) => {
  try {
    const page = await PageEntreprise.findById(req.params.id).populate(
      "master ",
      "firstName lastName"
    );
    if (!page) {
      return res.status(404).json({ error: "Page not founded" });
    }
    res.status(201).json({ page });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const removePageEntreprise = async (req, res) => {
  try {
    const pageId = req.params.id;
    const deletePage = await PageEntreprise.findByIdAndDelete(pageId);
    if (!deletePage) {
      res.status(404).json({ error: "Page not found" });
      return;
    }
    res.status(201).json({ massage: "Page is deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  creatPageEntreprise,
  addNewAdmin,
  getPageEntreprise,
  removePageEntreprise,
  removeAdmin,
};
