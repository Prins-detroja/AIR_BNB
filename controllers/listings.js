const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("index.ejs", { allListing });
};
