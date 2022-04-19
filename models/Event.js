const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
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
    details:{
        type:String
    },
    page :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "PageEntreprise"
    }
});
module.exports = mongoose.model("Event", eventSchema);