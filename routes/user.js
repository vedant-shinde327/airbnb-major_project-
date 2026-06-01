import express from "express";
const router = express.Router();
import passport from "passport";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import User from "../models/user.js";
import {  saveRedirectUrl } from "../middleware.js";
import { signUp, rendersignUpForm, renderloginForm, login, logout } from "../controllers/users.js";

router.get("/signup", (rendersignUpForm));

//signup router
router.post(
  "/signup",
  wrapAsync(signUp)
);

router.get("/login", (renderloginForm));

//login
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  login
);

//logout
router.get("/logout", (logout));

export default router;
