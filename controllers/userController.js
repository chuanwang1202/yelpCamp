const User = require("../models/user");
const flash = require("connect-flash");
const ExpressError = require("../utilities/expressError");

module.exports.renderRegister = (req, res) => {
    res.render("users/register");
}

module.exports.postRegister = async (req, res, next) => {
    try {
        const {username, email, password} = req.body;
        const newUser = new User({username, email});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Successfully Signed up!");
            res.redirect("/campgrounds");
        });
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
}

module.exports.renderLogin = (req, res) => {
    res.render("users/login");
}

module.exports.postLogin = (req, res) => {
    req.flash("success", "Welcome Back!");
    const returnURL = req.session.returnTo || "/campgrounds";
    console.log(req.session.returnTo)
    delete req.session.returnTo;
    res.redirect(returnURL);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash("success", "You have successfully logged out!");
    res.redirect("/campgrounds");
}