import express from "express";
import mongoose from "mongoose";
import Listing from "./models/listing.js";
import path, { join } from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import wrapAsync from "./utils/wrapAsync.js";
import ExpressError from "./utils/ExpressError.js";
import {listingSchema, reviewSchema} from "./schema.js";    
import Review from "./models/review.js";

const app = express();

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

app.get("/", (req, res) => {
    res.send("i love you sangita");
});

// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "my new villa",
//         description: "by the sea",
//         price: 1200,
//         location: "Goa",
//         country: "india"
//     })
//     await sampleListing.save();
//     console.log("sample was saved"),
//     res.send("succeful tested");
// })

const validateListing = (req, res, next ) => {
    let {error } = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//index route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
}));

//new route
app.get("/listings/new", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listng = await Listing.findById(id);
    res.render("listings/new.ejs");
}));
//show routes
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}));

//create route
app.post("/listings", validateListing, wrapAsync(async(req, res, next) => {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
}));

//edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

//update route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

//delete routes
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

// reviews
app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

console.log("new review saved");
res.send("new review send");
}));

app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    let{status = 500, message = "something went wrong"} = err;
    res.status(status).render("error.ejs", {err});
    // res.status(status).send(message);
 });

app.listen("3000", () => {
    console.log("Server is running");
});
