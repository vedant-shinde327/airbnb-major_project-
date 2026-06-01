import express from "express";
const router = express.Router();
import Listing from "../models/listing.js";
import wrapAsync from "../utils/wrapAsync.js";
import review from "../models/review.js";
import { isLoggedIn, isOwner, validateListing } from "../middleware.js";
import User from "../models/user.js";
import {
  createListing,
  index,
  renderNewForm,
  showListing,
  editListing,
  updateListing,
  deleteListing,
} from "../controllers/listings.js";
import multer from "multer";
import {cloudinary, storage} from '../cloudConfig.js';

const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(index))
  .post(
    isLoggedIn,
    validateListing,
    upload.single("listing[image]"),
    wrapAsync(createListing),
);

  //new route
router.get("/new", isLoggedIn, wrapAsync(renderNewForm));

router
  .route("/:id")
  .get(wrapAsync(showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    updateListing,
    validateListing,
    wrapAsync(updateListing),
  )
  .delete(isLoggedIn, isOwner, wrapAsync(deleteListing));

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editListing));

export default router;