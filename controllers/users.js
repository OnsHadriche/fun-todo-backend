//Password handle
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const transporter = require('../utilities/sendEmail')

// mongoose user model
const User = require("../models/User");
const {registerValidator,loginValidator} = require("../utilities/validators");


//Get all users
const getAllUsers = async (req,res)=>{
  try {
    const users = await User.find()
    res.status(200).json({users})
  } catch (error) {
    res.status(500).json({ error: error.message })
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
        .json({ message: "An account with this email exists already" });
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
      res.status(400).json({ result: validatorResult });
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
const forgetPassword = async (req, res) => {
  try {
    const {email}= req.body
    const existUser = await User.findOne({email})
    if(!existUser){
      return res.status(400).json({error: 'User with this email does not exists. '})
  
    }
    const token = JWT.sign({ userId: existUser._id, email: email}, process.env.RESET_KEY,{expiresIn:'24h'})
    const data ={
      from: process.env.HOST,
      to:email,
      subject:"Account activation link",
      html:`
      <h2>Please click the given link to reset your password </h2>
      <p>http://localhost:5000/auth/reset_password/${existUser._id}/${token}</p>`
    } 
    transporter.sendMail(data, err=>{
      if(err){
       return res.status(400).json({
         error: err.message
       })
      }

      res.status(200).json({
        message: 'email send successfully',
        existUser,
        resetLink: token
      })
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}




module.exports = {
  register,
  login,
  reset_password,
  forgetPassword,
  getAllUsers
};
