const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const ExpressErr = require('../utils/ExpressErr');
const {listingValidationSchema} = require('../schema.js');
const Listing = require('../models/listing.js');


const validateListing = (req,res,next) =>{
    const {error} = listingValidationSchema.validate(req.body);
    if(error){
        throw new ExpressErr(400, error);     
    }else{
        next();
    }
};



router.get('/', wrapAsync(async (req, res) => {
   
     const allListing = await Listing.find({})
     res.render("index.ejs",{allListing});
}));

router.get('/new',(req,res) =>{
    res.render("new.ejs")
 });

router.get('/:id', wrapAsync(async (req,res) =>{
    let {id} = req.params;
    const item = await Listing.findById(id).populate('reviews');
    res.render('show.ejs',{item})
}));

router.post('/',
        validateListing,
        wrapAsync(async (req,res,next) =>{
        let {title,description,image,price,location,country} = req.body;
     
    let newlisting = await new Listing({
        title : title,
        description : description,
        image : image,
        price : price ,
        location : location,
        country : country 
    }); 
    

    await newlisting.save();
    res.redirect('/listings'); 
   
}));


router.get("/:id/edit", wrapAsync(async (req,res) =>{
    let {id} = req.params;
    const item = await Listing.findById(id)
    res.render('edit.ejs',{item})
}));

router.put("/:id",
    validateListing,
    wrapAsync(async(req,res) =>{
    
    let {id} = req.params;
    let {title,
        description,
       image,
       price,
       location,
   country}=req.body;
   
      const updatedList =await Listing.findByIdAndUpdate(id, {
       title:title,
       description: description,
       image:image,
       price:price,
       location:location,
       country:country
      }) ;
      res.redirect(`/listings/${id}`);
}));

router.delete("/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let item = await Listing.findByIdAndDelete(id);
    console.log(item);
    res.redirect("/listings")
    
}));

module.exports = router;