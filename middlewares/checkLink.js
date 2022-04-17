const Token = require("../models/verificationToken")
const jwt = require('jsonwebtoken')

module.exports= async function(req, res, next){
    try {
     const {userId, token} = req.body
     if(!token){
       return res.status(401).json({error: "No token provided, authorization denied"})
     }
     const verifiedLink = await Token.find({id : userId, token:token})
     if(!verifiedLink){
       return res.status(404).json({error: 'Invalid request/or token expired'})
     }
     next()
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
