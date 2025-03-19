const Joi = require('joi');

// Joi schema to validate the listing data
const listingValidationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().uri().allow('',null).default('https://a0.muscache.com/im/pictures/hosting/Hosting-1295441703437640684/original/2a694648-5106-45ec-9d06-d9522255d3bc.jpeg?im_w=1200&im_format=avif'),
  price: Joi.number().required().min(0),
  location: Joi.string().required(),
  country: Joi.string().required(),
});



// Joi schema to validate the review data
const reviewValidationSchema = Joi.object({
  
   rating: Joi.number().required().min(1).max(5),
   comment: Joi.string().required(),

});

module.exports = {reviewValidationSchema,listingValidationSchema} ;
