//Password handle
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const transporter = require("../utilities/sendEmail");
const Token = require("../models/verificationToken");
// mongoose user model

const PageEntreprise = require("../models/PageEntreprise");
const User = require("../models/User");
const Hotel = require("../models/Hotel");
const Event = require("../models/Event")
const Package = require("../models/Package");
const {
  registerValidator,
  loginValidator,
  resetValidator,
  forgetPasswordValidator,
  updateValidator,
} = require("../utilities/validators");



//Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//Myprofile
const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ error: "Something went wrong" });
      return;
    }
    res.status(201).json({
      message: `Welcome again ${user.firstName}`,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//Register User
const register = async (req, res) => {
  try {
    const validatorResult = registerValidator.validate(req.body, {
      abortEarly: false,
    });
    if (validatorResult.error) {
      res.status(400).json({ result: validatorResult });
    } else {
      const { firstName, lastName, phoneNumber, email, password } = req.body;
      const userExist = await User.findOne({ email });
      if (userExist) {
        res
          .status(401)
          .json({ error: "An account with this email exists already" });
        return;
      }
      const salt = await bcrypt.genSalt(10);
      const pwdHash = await bcrypt.hash(password, salt);
      await new User({
        firstName,
        lastName,
        phoneNumber,
        email,
        password: pwdHash,
      }).save();
      res.status(201).json({ message: "Account created successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Login User
const login = async (req, res) => {
  try {
    const validatorResult = loginValidator.validate(req.body, {
      abortEarly: false,
    });
    if (validatorResult.error) {
      res.status(400).json(validatorResult);
      return;
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({
        error: "wrong email or password",
      });
      return;
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      res.status(401).json({
        error: "wrong email or password",
      });
      return;
    }
    user.password = undefined;
    //create authentication token
    const token = JWT.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(201).json({
      message: `Welcome ${user.firstName}`,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateUserInfo = async (req, res) => {
  try {
    const validationResult = updateValidator.validate(req.body, {
      abortEarly: false,
    });
    if (validationResult.error) {
      return res.status(400).json(validationResult);
    }
    const user = await User.findByIdAndUpdate(
      { _id: req.user._id },
      { $set: req.body },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    } else {
      res.status(201).json({ message: "user uptdated successfully", user });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const forgetPassword = async (req, res) => {
  try {
    const validatorResult = forgetPasswordValidator.validate(req.body, {
      abortEarly: false,
    });
    if (validatorResult.error) {
      res.status(400).json({ result: validatorResult });
      return;
    }
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ error: "User with this email does not exists. " });
    }
    const token = JWT.sign({ id: user._id }, process.env.RESET_KEY, {
      expiresIn: "4h",
    });
    await new Token({
      userId: user._id,
      token: token,
    }).save();
    const link = `http://localhost:${process.env.PORT}/auth/reset/${user._id}/${token}`;
    const data = {
      from: process.env.HOST,
      to: email,
      subject: "Account activation link",
      html: `
      <h2>Please click the given link to reset your password </h2>
      <p>  <a href='${link}' target='_blank'> Click here</a> </p>`,
    };
    transporter.sendMail(data, (err) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      res.status(200).json({
        message: "email send successfully",
        user,
        token: token,
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset_password
const resetPassword = async (req, res) => {
  try {
    const password = req.body.password;
    const userToupadateId = req.params.id;
    const validatorResult = resetValidator.validate(req.body, {
      abortEarly: false,
    });
    if (validatorResult.error) {
      res.status(400).json(validatorResult);
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(password, salt);
    const user = await User.findByIdAndUpdate(
      { _id: userToupadateId },
      { $set: { password: newPasswordHash } },
      { new: true }
    );
    res.status(201).json({
      message: "Password updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//add and remove favoriteList
//hotel
const createFavHotel = async (req, res) => {
  try {
    const hotelId = req.body.id;

    const addHotel = await Hotel.findById(hotelId);
    
    if (!addHotel) {
      res.status(404).json({ error: "Hotel not found" });
      return;
    }
    const userToUpdate = await User.findOneAndUpdate(
      {
        _id: req.user._id,
      },
      {
        $addToSet: { listFavoriteHotel: [addHotel] },
      },
      {new:true}
    );
    res.status(201).json({ message: "add succesufully", userToUpdate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const removeFromListFavoHotel = async(req,res)=>{
  try {
    const hotelId = req.body.id;

    const removeHotel = await Hotel.findById(hotelId);
    
    if (!removeHotel) {
      res.status(404).json({ error: "Hotel not found" });
      return;
    }
    const userToUpdate = await User.findOneAndUpdate(
      {
        _id: req.user._id
      },
      {
        $pull: { listFavoriteHotel: hotelId }
      },
      {new:true}
    );
    res.status(201).json({ message: "remove succesufully", userToUpdate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//pack
const createFavPack = async (req, res) => {
  try {
    const packId = req.body.id;
    const addPack = await Package.findById(packId);
    if (!addPack) {
      res.status(404).json({ error: "pack not found" });
      return;
    }
    const userToUpdate = await User.findOneAndUpdate(
      {
        id: req.user._id,
      },
      {
        $addToSet: { listFavoritePack: [addPack] },
      },
      {new:true}
    );
    res.status(201).json({ message: "add succesufully", userToUpdate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const removeFromListFavoPack = async(req,res)=>{
  try {
    const packId = req.body.id;

    const removePack = await Package.findById(packId);
    
    if (!removePack) {
      res.status(404).json({ error: "pack not found" });
      return;
    }
    const userToUpdate = await User.findOneAndUpdate(
      {
        _id: req.user._id
      },
      {
        $pull: { listFavoritePack: [packId] }
      },
      {new:true}
    );
    res.status(201).json({ message: "remove succesufully", userToUpdate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//event
const createFavEvent = async (req, res) => {
  try {
    const eventId = req.body.id;
    const addEvent = await Event.findById(eventId);
    if (!addEvent) {
      res.status(404).json({ error: "event not found" });
      return;
    }
    const userToUpdate = await User.findOneAndUpdate(
      {
        id: req.user._id,
      },
      {
        $addToSet: { listFavoriteEvent: [addEvent] },
      },
      {new:true}
    );
    res.status(201).json({ message: "add succesufully", userToUpdate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const removeFromListFavoriteEvent = async(req,res)=>{
  try {
    const eventId = req.body.id;

    const removeEvent = await Event.findById(eventId);
    
    if (!removeHotel) {
      res.status(404).json({ error: "event not found" });
      return;
    }
    const userToUpdate = await User.findOneAndUpdate(
      {
        _id: req.user._id
      },
      {
        $pull: { listFavoriteEvent: eventId }
      },
      {new:true}
    );
    res.status(201).json({ message: "remove succesufully", userToUpdate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//agence
const createFavAgency = async (req, res) => {
  try {
    const agencyId = req.body.id;
    const addAgency = await PageEntreprise.findById(agencyId);
    if (!addAgency) {
      res.status(404).json({ error: "Page not found" });
      return;
    }
    const userToUpdate = await User.findOneAndUpdate(
      {
        id: req.params._id,
      },
      {
        $addToSet: { listFavoriteAgence: [addAgency] },
      }
    );
    res.status(201).json({ message: "add succesufully", userToUpdate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const removeFromListFavoritePage = async(req,res)=>{
  try {
    const agencyId = req.body.id;

    const removeAgency = await PageEntreprise.findById(agencyId);
    
    if (!removeAgency) {
      res.status(404).json({ error: "Page not found" });
      return;
    }
    const userToUpdate = await User.findOneAndUpdate(
      {
        _id: req.user._id
      },
      {
        $pull: { listFavoriteAgence: agencyId }
      },
      {new:true}
    );
    res.status(201).json({ message: "remove succesufully", userToUpdate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};







module.exports = {
  register,
  login,
  resetPassword,
  forgetPassword,
  getAllUsers,
  updateUserInfo,
  getUserInfo,
  createFavHotel,
  createFavPack,
  createFavEvent,
  createFavAgency,
  removeFromListFavoHotel,
  removeFromListFavoPack,
  removeFromListFavoriteEvent,
  removeFromListFavoritePage
};
