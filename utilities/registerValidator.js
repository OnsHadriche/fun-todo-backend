const Joi = require('joi')
const checkNumber = Joi.extend(require('joi-phone-number'))

const registerValidator = Joi.object({
    firstName : Joi.string().alphanum().required(),
    lastName : Joi.string(),
    phoneNumber: checkNumber.string().phoneNumber({defaultCountry:'TN', format: 'rfc3966'}),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(4)
})

module.exports ={
    registerValidator
}