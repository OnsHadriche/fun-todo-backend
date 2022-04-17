const { ObjectId } = require("mongodb");
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
    const existingPage = await PageEntreprise.findById(req.params.id);
    const pageAdmins = existingPage.admins
    const existingUser = await User.findById(req.body.id)
    if(!existingUser){
      res.status(404).json({error: 'User not found'})
      return;
    }
    console.log(pageAdmins)
    const existingAdmin = pageAdmins.find(adminId=> ObjectId(adminId).toString() ===  req.body.id)
    console.log(existingAdmin);
    if(existingAdmin || req.body.id == existingPage.master._id){
      res.status(401).json({error:'Admin already existe'})
      return
    }
    await PageEntreprise.updateOne(
      { _id: req.params.id },
      { $push: { admins: [existingAdmin] } },
      { new: true }
     
    );
    res.status(201).json({ message: "New admin added successfully" });
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
    res
  }
};
module.exports = {
  creatPageEntreprise,
  addNewAdmin,
  getPageEntreprise,
};
const removePageEntreprise = async(req,res)=>{
  try {
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}