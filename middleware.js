const Campground = require("./models/campgound");
const Review = require("./models/review");
const ExpressError = require("./utilities/expressError");
const {reviewSchema, campgroundSchema} = require("./schemas.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }
    next()
}

module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "You are not authorized!");
        return res.redirect(`/campgrounds/${campground._id}`);
    }
    next()
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You are not authorized!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next()
}

module.exports.validateReview = (req, res, next) => {
    const {err} = reviewSchema.validate(req.body);
    if (err) {
        const msg = err.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.validateCampground = (req, res, next) => {
    const {err} = campgroundSchema.validate(req.body)
    if (err) {
        const msg = err.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}