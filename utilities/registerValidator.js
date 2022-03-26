const Joi = require('joi')

const registerValidator = Joi.object({
    firstName : Joi.string().alphanum().required(),
    lastName : Joi.string(),
    phoneNumber: Joi.string().phoneNumber(),
    email: Joi.string().email({tlds:{allow:false}}).required(),
    password: Joi.string().required().min(4)
})

module.exports ={
    registerValidator
}