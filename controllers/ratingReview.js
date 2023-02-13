const mongoose = require("mongoose");
const Review = require("../models/Review");


const getReviewByUser = async(req,res)=>{
    try {
        const hotelId = req.params.id;
        const userId = req.user._id;
        const reviewByUser = await Review.findOne({user: userId, hotel:hotelId})
        res.status(201).json(reviewByUser)
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
module.exports ={
    getReviewByUser
}