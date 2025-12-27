// many if condition to check if title ..etc exist or not for server side validation so , we use joi
const Joi = require('joi');  

module.exports.listingSchema =Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country: Joi.string().required(),
        price : Joi.number().required().min(0),
        image : Joi.string().allow("",null)
    }).required()
})