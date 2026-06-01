import User from "../models/user.js";

export const rendersignUpForm = (req, res) => {
  res.render("users/signup.ejs");
};

export const signUp = (async (req, res, next) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);

      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "welcome to Wanderlust");
        res.redirect("/listings");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
});

export const renderloginForm = (req, res) => {
  res.render("users/login.ejs");
};

export const login = async (req, res) => {
    req.flash("success", "welcome to wanderlust, you are loggedin");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "you are logged out");
    res.redirect("/listings");
  });
};