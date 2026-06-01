import Listing from "../models/listing.js";

export const index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
};

export const renderNewForm = (async (req, res) => {
    let { id } = req.params;
    const listng = await Listing.findById(id);
    res.render("listings/new.ejs");
});

export const showListing = (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
});

export const createListing = (async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();

    req.flash("success", "New Listing Created");

    res.redirect("/listings");
});

export const editListing = (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing });
});

export const updateListing = (async (req, res) => {
    let { id } = req.params;

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    req.flash("success", "Listing Updated");

    res.redirect(`/listings/${id}`);
});

export const deleteListing = (async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted");

    res.redirect("/listings");
  });