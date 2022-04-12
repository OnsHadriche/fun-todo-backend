const mongoose = require('mongoose')

const tokenSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        require: true
    },
    createAt: {
        type: Date,
        expires: 3600,
        default: Date.now()
    }
})

module.exports= mongoose.model('Token', tokenSchema)