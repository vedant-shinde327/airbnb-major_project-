import express from "express";
const app = express();

import mongoose from "mongoose";
import path, { join } from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import ExpressError from "./utils/ExpressError.js";
import cookieParser from "cookie-parser";
import flash from "connect-flash";
import session from "express-session";
import passport from "passport";
import LocalStrategy from "passport-local";
import User from "./models/user.js";
import pkg from "passport-local-mongoose";

import listingRouter from "./routes/listings.js";
import reviewRouter from "./routes/review.js";
import userRouter from "./routes/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

main()
    .then(() => {
        console.log("connected to db");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);
app.use(cookieParser());    

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

app.get("/", (req, res) => {
  res.send("i love you sangita");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

//listings
app.use("/listings", listingRouter);
// reviews
app.use("/listings/:id/reviews", reviewRouter);
//userrouter
app.use("/", userRouter);

//errs
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    let{status = 500, message = "something went wrong"} = err;
    res.status(status).render("error.ejs", {err});
 });

app.listen("3000", () => {
    console.log("Server is running");
});