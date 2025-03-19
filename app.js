const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate");
const ExpressErr = require('./utils/ExpressErr');
// const Review = require('./models/review.js');
// const {listingValidationSchema} = require('./schema.js');  // always named export
// const {reviewValidationSchema} = require('./schema.js');
// const wrapAsync = require('./utils/wrapAsync');
// const Listing = require('./models/listing.js');

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

app.engine("ejs",ejsMate);
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_method"));
app.use(express.static("public"));


main().then(() => console.log('Connected to MongoDB'))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');

}

app.listen(3000, () => {    
    console.log('Server is running on port 3000');
});

// const validateListing = (req,res,next) =>{
//     const {error} = listingValidationSchema.validate(req.body);
//     if(error){
//         throw new ExpressErr(400, error);     
//     }else{
//         next();
//     }
// };

//     const validateReview = (req,res,next) =>{
//         const {error} = reviewValidationSchema.validate(req.body);
//         if(error){
//             throw new ExpressErr(400, error);     
//         }else{
//             next();
//         }
// }

app.get('/', (req, res) => {
    res.send('Hello, i am root');
});

// app.get('/listings', wrapAsync(async (req, res) => {
   
//      const allListing = await Listing.find({})
//      res.render("index.ejs",{allListing});
// }));

// app.get('/listings/new',(req,res) =>{
//     res.render("new.ejs")
//  });

// app.get('/listings/:id', wrapAsync(async (req,res) =>{
//     let {id} = req.params;
//     const item = await Listing.findById(id).populate('reviews');
//     res.render('show.ejs',{item})
// }));

// app.post('/listings',
//         validateListing,
//         wrapAsync(async (req,res,next) =>{
//         let {title,description,image,price,location,country} = req.body;
     
//     let newlisting = await new Listing({
//         title : title,
//         description : description,
//         image : image,
//         price : price ,
//         location : location,
//         country : country 
//     }); 
    

//     await newlisting.save();
//     res.redirect('/listings'); 
   
// }));


// app.get("/listings/:id/edit", wrapAsync(async (req,res) =>{
//     let {id} = req.params;
//     const item = await Listing.findById(id)
//     res.render('edit.ejs',{item})
// }));

// app.put("/listings/:id",
//     validateListing,
//     wrapAsync(async(req,res) =>{
    
//     let {id} = req.params;
//     let {title,
//         description,
//        image,
//        price,
//        location,
//    country}=req.body;
   
//       const updatedList =await Listing.findByIdAndUpdate(id, {
//        title:title,
//        description: description,
//        image:image,
//        price:price,
//        location:location,
//        country:country
//       }) ;
//       res.redirect(`/listings/${id}`);
// }));

// app.delete("/listings/:id", wrapAsync(async (req,res)=>{
//     let {id} = req.params;
//     let item = await Listing.findByIdAndDelete(id);
//     console.log(item);
//     res.redirect("/listings")
    
// }));

  //review

app.use("/listings",listings) ;

app.use("/listings/:id/reviews",reviews);

// app.post('/listings/:id/reviews',
//     validateReview,
//     wrapAsync(async (req,res) =>{
//     let {id} = req.params;
//     let listing = await Listing.findById(id);
//     let {rating,comment} = req.body;
//     let newReview = new Review({
//         rating: rating,
//         comment: comment
//     });
//     listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();
//     res.redirect(`/listings/${id}`);

// }));

// // delete rating

// app.delete("/listings/:id/reviews/:reviewId" , wrapAsync( async (req , res) =>{
//     let {id, reviewId } = req.params;
//     await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}});
//     await Review.findByIdAndDelete(reviewId);   //always after listing
    
//     res.redirect(`/listings/${id}`);
    
// }));


app.all("*",(req,res,next) =>{
    next(new ExpressErr(502,"Page not found!"));
});



app.use((err, req, res, next) => {
   
  const { status = 500, message = "Something went wrong!" } = err;
   res.render("error.ejs",{message})// Send the error response
  // res.status(status).send(message);
});


// const express = require('express');
// const mongoose = require('mongoose');
// const Listing = require('./models/listing.js');
// const path = require('path');
// const methodOverride = require('method-override');
// const ejsMate = require("ejs-mate");
// const wrapAsync = require('./utils/wrapAsync');
// const ExpressErr = require('./utils/ExpressErr');
// const {listingValidationSchema} = require('./schema');

// const app = express();

// // Setting up the view engine
// app.engine("ejs", ejsMate);
// app.use(express.urlencoded({ extended: true }));
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.static(path.join(__dirname, "public")));
// app.use(methodOverride("_method"));

// // MongoDB connection
// main().then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.log(err));

// async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
// }

// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });

// // Routes
// app.get('/', (req, res) => {
//   res.send('Hello, I am root');
// });

// app.get('/listings', wrapAsync(async (req, res) => {
//   const allListing = await Listing.find({});
//   res.render("index.ejs", { allListing });
// }));

// app.get('/listings/new',(req, res) => {
//   res.render("new.ejs");
// });

// app.get('/listings/:id', wrapAsync(async (req, res) => {
//   let { id } = req.params;
//   const item = await Listing.findById(id);
//   res.render('show.ejs', { item });
// }));

// app.post('/listings', wrapAsync(async (req, res, next) => {
//     listingValidationSchema.validate(req.body);
//   let { title, description, image, price, location, country } = req.body;

//   let newListing = new Listing({
//     title,
//     description,
//     image,
//     price,
//     location,
//     country
//   });

//   await newListing.save();
//   res.redirect('/listings');
// }));

// app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
//   let { id } = req.params;
//   const item = await Listing.findById(id);
//   res.render('edit.ejs', { item });
// }));

// app.put("/listings/:id", wrapAsync(async (req, res) => {
//   if (!req.body) throw new ExpressErr(400, "Invalid data");
//   let { id } = req.params;
//   let { title, description, image, price, location, country } = req.body;

//   const updatedList = await Listing.findByIdAndUpdate(id, {
//     title, description, image, price, location, country
//   });

//   res.redirect(`/listings/${id}`);
// }));

// app.delete("/listings/:id", wrapAsync(async (req, res) => {
//   let { id } = req.params;
//   let item = await Listing.findByIdAndDelete(id);
//   console.log(item);
//   res.redirect("/listings");
// }));


// app.all("*", (req, res, next) => {
//  return next(new ExpressErr(404, "Page not found!"));
// });

// // Error handling middleware

