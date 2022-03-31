const nodemailer = require('nodemailer')
//create transporter
const transporter = nodemailer.createTransport({
    // HOST:'smtp.gmail.com', 
    service: process.env.SERVICE,
    port:587,
    secure:true,
    auth:{
        user:process.env.HOST,
        pass: process.env.PASSWORD_EMAIL
    }
})
module.exports = transporter