import express from "express";
const router = express.Router({mergeParams: true});
import Review from "../models/review.js";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import Listing from "../models/listing.js"; 
import { validateReview, isLoggedIn, isReviewAuthor } from "../middleware.js";
import { createReview, deleteReview } from "../controllers/reviews.js";

//create review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(createReview)
);

//delete revie route
router.delete(
  "/:reviewId",
  isLoggedIn, 
  isReviewAuthor, 
  wrapAsync(deleteReview)
);

export default router;