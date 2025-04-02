const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressErr = require("../utils/ExpressErr.js");
const { listingValidationSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../utils/middleware.js");
const listingController = require("../controllers/listings.js");

const validateListing = (req, res, next) => {
  const { error } = listingValidationSchema.validate(req.body);
  if (error) {
    throw new ExpressErr(400, error);
  } else {
    next();
  }
};

router.get("/", wrapAsync(listingController.index));

router.get("/new", isLoggedIn, (req, res) => {
  res.render("new.ejs");
});

//show
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const item = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");

    if (!item) {
      req.flash("error", "Listing you want to find does not exist!");
      res.redirect("/listings");
    }
    res.render("show.ejs", { item });
  })
);

//all listing
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    let { title, description, image, price, location, country } = req.body;

    let newlisting = await new Listing({
      title: title,
      description: description,
      image: image,
      price: price,
      location: location,
      country: country,
    });

    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success", "new listing created !");
    res.redirect("/listings");
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const item = await Listing.findById(id);
    if (!item) {
      req.flash("error", "Listing you want to edit does not exist!");
      res.redirect("/listings");
    }

    res.render("edit.ejs", { item });
  })
);

//edit
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let { title, description, image, price, location, country } = req.body;

    const updatedList = await Listing.findByIdAndUpdate(id, {
      title: title,
      description: description,
      image: image,
      price: price,
      location: location,
      country: country,
    });

    if (!Listing) {
      req.flash("error", "Listing you want to edit does not exist!");
      res.redirect("/listings");
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let item = await Listing.findByIdAndDelete(id);
    console.log(item);
    req.flash("success", "listing Deleted !");
    res.redirect("/listings");
  })
);

module.exports = router;
