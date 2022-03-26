
const bcrypt  = require('bcryptjs')

const User = require ('../models/user')
const {registerValidator} = require('../utilities/registerValidator')

const Register = async (req, res)=>{
    try {
        const userValidator = registerValidator.validate(req.body , {abortEarly: false})
        if(userValidator.error){
            res.status(400).json({userValidator})
        } else{
            const {firstName, lastName, phoneNumber,email, password} = req.body
            const userExist = await User.findOne({email})
            if(userExist){
                res.status(401).json({message:'An account with this email exists already'})
                return
            }
            const salt = await bcrypt.genSalt(20)
            const pwdHash = await bcrypt.hash(password, salt)
            await new User ({
                firstName,
                lastName,
                phoneNumber,
                email,
                password:pwdHash
            }).save()
            res.status(201).json({message: 'Account created successfully'})
        }
    } catch (error) {
        res.status(500).json({error: error.message})
    }

}
 module.exports = {
     Register
 }