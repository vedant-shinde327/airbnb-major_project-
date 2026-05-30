import express from "express";
const router = express.Router();
import passport from "passport";

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", async (req, res) => {

        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.flash("success", "welcome to Wanderlust");
        res.redirect("/listings");
});

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login", passport.authenticate("local", {failureRedirect: '/login', failureFlash: true}), async (req, res) => {
    req.flash("success", "welcome to wanderlust, you are loggedin");
    res.redirect("/listings");
});

export default router;