import mongoose, { Schema, trusted } from "mongoose";
const schema = mongoose.Schema;
import User from "./user.js";

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now() 
    },
    author: {
        type: schema.Types.ObjectId,
        ref: "User",
    }
});

export default mongoose.model("review", reviewSchema);