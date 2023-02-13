const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getAllUsers,
  forgetPassword,
  resetPassword,
  updateUserInfo,
  getUserInfo,
  createFavPack,
  createFavEvent,
  createFavAgency,
  removeFromListFavoHotel,
  removeFromListFavoPack,
  removeFromListFavoriteEvent,
  removeFromListFavoritePage,
} = require("../controllers/users");
const checkAuth = require("../middlewares/check-auth");
const checkLink = require("../middlewares/checkLink");
const multerFileUploadCloud =require("../middlewares/multer-fileUpload/cloudinary")
router.get("/allUsers", getAllUsers);
router.get("/myprofile", checkAuth, getUserInfo);
router.post("/register",multerFileUploadCloud,register);
router.post("/login", login);
router.put("/user-profile", multerFileUploadCloud,checkAuth, updateUserInfo);
router.post("/forget_password", forgetPassword);
router.put("/reset/:id/:token", checkLink, resetPassword);
router.put("/add-fav-pack", checkAuth, createFavPack);
router.put("/add-fav-event", checkAuth, createFavEvent);
router.put("/add-fav-agency", checkAuth, createFavAgency);
router.put("/remove-fav-hotel", checkAuth, removeFromListFavoHotel)
router.put("/remove-fav-pack", checkAuth, removeFromListFavoPack)
router.put("/remove-fav-event", checkAuth, removeFromListFavoriteEvent)
router.put("/remove-fav-agency", checkAuth, removeFromListFavoritePage)


module.exports = router;
