const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) =>({
       ...obj,
       owner : "67ea0ff338a05e3b4623896a"
  }));
  await Listing.insertMany(initData.data);
};

initDB();
