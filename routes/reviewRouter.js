const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressErr = require('../utils/ExpressErr.js');
const {reviewValidationSchema} = require('../schema.js');
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const { isLoggedIn ,isReviewAuthor } = require('../utils/middleware.js');

const validateReview = (req,res,next) =>{
    const {error} = reviewValidationSchema.validate(req.body);
    if(error){
        throw new ExpressErr(400, error);     
    }else{
        next();
    }
}

router.post('/',
    isLoggedIn,
    validateReview,
    wrapAsync(async (req,res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let {rating,comment} = req.body;
    let newReview = new Review({
        rating: rating,
        comment: comment
    });
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
  
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Added!")
    res.redirect(`/listings/${id}`);

}));

// delete rating
router.delete("/:reviewId" ,
    isLoggedIn ,
    isReviewAuthor,
     wrapAsync( async (req , res) =>{
    let {id, reviewId } = req.params;
    
   
    await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);   //always after listing
    req.flash("success","Review Deleted!")
    res.redirect(`/listings/${id}`);
    
}));

module.exports = router;