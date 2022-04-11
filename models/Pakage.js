const mongoose = require('mongoose')


const pakageSchema = mongoose.Schema({
    photo: {
        type: String
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
    }
})

module.exports = mongoose.model('Pakage', pakageSchema)