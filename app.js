import express from "express";
const app = express();

import mongoose from "mongoose";
import path, { join } from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import ExpressError from "./utils/ExpressError.js";
import cookieParser from "cookie-parser";


import listingRouter from "./routes/listings.js";
import reviewRouter from "./routes/review.js";

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

app.get("/", (req, res) => {
    res.send("i love you sangita");
});

//listings
app.use("/listings", listingRouter);

// reviews
app.use("/listings/:id/reviews", reviewRouter);

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