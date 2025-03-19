const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync');
const ExpressErr = require('../utils/ExpressErr');
const {reviewValidationSchema} = require('../schema.js');
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');

const validateReview = (req,res,next) =>{
    const {error} = reviewValidationSchema.validate(req.body);
    if(error){
        throw new ExpressErr(400, error);     
    }else{
        next();
    }
}

router.post('/',
    validateReview,
    wrapAsync(async (req,res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let {rating,comment} = req.body;
    let newReview = new Review({
        rating: rating,
        comment: comment
    });
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`);

}));

// delete rating
router.delete("/:reviewId" , wrapAsync( async (req , res) =>{
    let {id, reviewId } = req.params;
    
   
    await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);   //always after listing
    
    res.redirect(`/listings/${id}`);
    
}));

module.exports = router;