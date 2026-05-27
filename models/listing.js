import mongoose, { trusted } from "mongoose";
import Review from "./review.js";

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
    filename: {
        type: String,
        default: "listingimage",
    },
    
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      set: (v) =>
        v === ""
          ? "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
          : v,
    },
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
    }
  ]
});

listingSchema.post("findOneAndDelete", async(listing) => {
  if(listing) {
    await Review.deleteMany({_id: {$in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;