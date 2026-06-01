import express from "express";
const router = express.Router();
import Listing from "../models/listing.js";
import wrapAsync from "../utils/wrapAsync.js";
import review from "../models/review.js";
import { isLoggedIn, isOwner, validateListing } from "../middleware.js";
import User from "../models/user.js";
import { createListing, index, renderNewForm, showListing, editListing, updateListing, deleteListing } from "../controllers/listings.js";

//index route
router.get("/", wrapAsync(index));

//new route
router.get("/new", isLoggedIn, wrapAsync(renderNewForm));

//show routes
router.get("/:id", wrapAsync(showListing));

//create route
router.post("/", validateListing, wrapAsync(createListing));

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editListing));

//update route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(updateListing));

//delete routes
router.delete( "/:id", isLoggedIn, isOwner, wrapAsync(deleteListing));

export default router;