const Joi = require('joi')
const checkNumber = Joi.extend(require('joi-phone-number'))

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
const resetValidator =Joi.object({

})

module.exports ={
    registerValidator,
    loginValidator
}