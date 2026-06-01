import mongoose, { trusted } from "mongoose";
import initData from "./data.js";
import Listing from "../models/listing.js";

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
};

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6a1b1e8f09281f2b89e46734",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
