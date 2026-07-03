import express from "express";
import multer from "multer";

import { storage } from "../cloudConfig.js";
import {
  createListing,
  deleteListing,
  editListing,
  index,
  renderNewForm,
  showListing,
  updateListing,
} from "../controllers/listings.js";
import { isLoggedIn, isOwner, validateListing } from "../middleware.js";
import wrapAsync from "../utils/wrapAsync.js";

const router = express.Router();
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

// New route
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

// Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editListing));

export default router;
