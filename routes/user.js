import express from "express";
const router = express.Router();
import passport from "passport";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import User from "../models/user.js";
import {  saveRedirectUrl } from "../middleware.js";
import { signUp, rendersignUpForm, renderloginForm, login, logout } from "../controllers/users.js";

router
  .route("/signup")
  .get( rendersignUpForm)
  .post( wrapAsync(signUp));

router
  .route("/login")
  .get(renderloginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    login,
  );

//logout
router.get("/logout", (logout));

export default router;