import mongoose, { trusted } from "mongoose";
import Review from "./review.js";
import User from "./user.js";

const schema = mongoose.Schema;

const listingSchema = new schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    url: String,
    filename: String
  },
  price: {
    type: Number,
    rquired: true,
  },
  location: String,
  country: String,
  reviews: [
    {
      type: schema.Types.ObjectId,
      ref: "review",
    },
  ],
  owner: {
    type: schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
  },
});

listingSchema.post("findOneAndDelete", async(listing) => {
  if(listing) {
    await Review.deleteMany({_id: {$in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;