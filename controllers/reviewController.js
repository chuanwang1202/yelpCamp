const Review = require("../models/review");
const Campground = require("../models/campgound");
const flash = require("connect-flash");

module.exports.postNewReview = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const newReview = new Review(req.body);
    newReview.author = req.user._id;
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash("success", "Successfully Created Your Review!");
    res.redirect(`/campgrounds/${campground.id}`);
}

module.exports.deleteReview = async (req, res, next) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully Deleted Your Review!");
    res.redirect(`/campgrounds/${id}`);
}

