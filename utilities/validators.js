const Joi = require('joi')
const checkNumber = Joi.extend(require('joi-phone-number'))
//User
const registerValidator = Joi.object({
    firstName : Joi.string().alphanum().required(),
    lastName : Joi.string(),
    phoneNumber: checkNumber.string().phoneNumber({defaultCountry:'TN', format: 'rfc3966'}),
    email: Joi.string().email().required(),
    password: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@<>!%&*?])[A-Za-z\d#$@<>!%&*?]{4,30}$/),
    repeatPassword : Joi.ref('password')
})
const loginValidator = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required()
})
const forgetPasswordValidator = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required()
})
const resetValidator =Joi.object({
    password: Joi.string().required()

 })
 //PageEntreprise
 const pageValidator = Joi.object({
    title: Joi.string().required().min(2),
    description: Joi.string(),
    photo: Joi.string(),
    contact: checkNumber.string().phoneNumber({defaultCountry:'TN', format: 'rfc3966'})
 })
 //Package
 const packageValidator = Joi.object({
    title: Joi.string().required().min(2).max(70),
    details: Joi.string(),
    photo: Joi.string(),
    price: Joi.number().required(),
    country: Joi.string().required(),
    expiredAt: Joi.date().iso().required()

});
//Hotel
 const hotelValidator = Joi.object({
    title: Joi.string().required().min(2).max(70),
    details: Joi.string(),
    photo: Joi.string(),
    price: Joi.number().required(),
    chambre: Joi.number().required(),
    country: Joi.string().required()

});
//Event
 const eventValidator = Joi.object({
    title: Joi.string().required().min(2).max(70),
    details: Joi.string(),
    photo: Joi.string(),
    price: Joi.number().required(),
    country: Joi.string().required()

});



module.exports ={
    registerValidator,
    loginValidator,
    resetValidator,
    forgetPasswordValidator,
    packageValidator,
    pageValidator,
    hotelValidator,
    eventValidator
}