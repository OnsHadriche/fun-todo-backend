const Token = require("../models/verificationToken")

module.exports= async function(req, res, next){
    try {
     const {userId, token} = req.body
     const verifiedLink = await Token.find({id : userId, token:token})
     if(!verifiedLink){
       return res.status(404).json({error: 'Invalid request/or token expired'})
     }
     next()
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
