const User = require('../models/User')
const jwt = require('jsonwebtoken');

module.exports = async function(req,res, next){
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json({ error: "No token provided, authorization denied" });
        return;
    }
    try {
        const verifiedAndDecode = jwt.verify(token, process.env.JWT_SECRET )
        const userId = verifiedAndDecode.userId
        const user = await User.findById(userId)
        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({ error: "Invalid/Expired token" });
    }
}