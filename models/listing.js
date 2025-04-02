const mongoose = require("mongoose");
const Review = require("./review");
const User = require("./user");
const Schema = mongoose.Schema;

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1295441703437640684/original/2a694648-5106-45ec-9d06-d9522255d3bc.jpeg?im_w=1200&im_format=avif",
    set: (v) =>
      v === ""
        ? "https://a0.muscache.com/im/pictures/hosting/Hosting-1295441703437640684/original/2a694648-5106-45ec-9d06-d9522255d3bc.jpeg?im_w=1200&im_format=avif"
        : v,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
