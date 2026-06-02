import mongoose, { trusted } from "mongoose";
import initData from "./data.js";
import Listing from "../models/listing.js";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

console.log(process.env.MAP_TOKEN);

import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding.js";

const geocodingClient = mbxGeocoding({
  accessToken: process.env.MAP_TOKEN,
});

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
  for (let obj of initData.data) {
    obj.owner = "6a1b1e8f09281f2b89e46734";

    let response = await geocodingClient
      .forwardGeocode({
        query: `${obj.location}, ${obj.country}`,
        limit: 1,
      })
      .send();

    obj.geometry = response.body.features[0].geometry;
  }
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
