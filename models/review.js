import mongoose, { Schema, trusted } from "mongoose";
const schema = mongoose.Schema;

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
    }
});

export default mongoose.model("review", reviewSchema);