//Password handle
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const transporter = require("../utilities/sendEmail");


// mongoose user model
const User = require("../models/User");

const {
  registerValidator,
  loginValidator,
  resetValidator,
  forgetPasswordValidator,
  updateValidator,
} = require("../utilities/validators");
const Token = require("../models/verificationToken");

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
const getUserInfo = async (req, res) =>{
  try {
    const user = await User.findById(req.user._id)
    if(!user){
      res.status(404).json({error:'Something went wrong'})
    return
    }
    res.status(201).json({
      message: `Welcome again ${user.firstName}`,
      user 
    })

  } catch (error) {
    res.status(500).json({ error: error.message });
    
  }
}
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
const updateUserInfo = async(req,res)=>{
  try {
    const validationResult = updateValidator.validate(req.body, {
      abortEarly: false,
    });
    if (validationResult.error) {
      return res.status(400).json(validationResult);
    }
    const user = await User.findByIdAndUpdate(
      { _id: req.user._id},
      { $set: req.body },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    } else {
      res
        .status(201)
        .json({ message: "user uptdated successfully", user });
    }
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
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
    const password = req.body.password
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
//add favoriteList


module.exports = {
  register,
  login,
  resetPassword,
  forgetPassword,
  getAllUsers,
  updateUserInfo,
  getUserInfo,
};
