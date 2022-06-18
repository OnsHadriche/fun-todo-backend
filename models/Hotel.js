const mongoose = require("mongoose");

const hotelSchema = mongoose.Schema({
    photo: {
        type: String,
        default:' '
    },
    title:{
        type:String,
        required: true
    },
    price:{
        type: Number,
        required:true
    },
    country:{
        type:String,
        required: true
    },
    photos:[{
        type: String,
        default:' '
    }],
    details:{
        type:String
    },
    rooms:{
        type:Number,
        required: true,
        min:0,
        max:1000
    },
    rating:{
        type: Number,
        default:0
    },
    isFeatured:{
        type:Boolean,
        default:false
    },
   
    page :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "PageEntreprise"
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model("Hotel", hotelSchema);