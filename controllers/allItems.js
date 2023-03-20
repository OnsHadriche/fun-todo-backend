const Event = require("../models/Event");
const Hotel = require("../models/Hotel");
const Package = require("../models/Package");
const PageEntreprise = require("../models/PageEntreprise");

const getAllItems = async (req, res) => {
  try {
    const package = await Package.find().populate({
      path: "page",
      model: "PageEntreprise",
      select: "title",
    });
    const events = await Event.find().populate([
      { path: "user", model: "User", select: "firstName lastName" },
      { path: "page", model: "PageEntreprise", select: "title" },
      
    ]);
    const hotels = await Hotel.find().populate({
      path: "page",
      model: "PageEntreprise",
      select: "title",
    });
    const page = await PageEntreprise.find().populate(
      "master ",
      "firstName lastName"
    );
    res
      .status(201)
      .json({ hotel: hotels, pack: package, event: events, page: page });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  getAllItems,
};
