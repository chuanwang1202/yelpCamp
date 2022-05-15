const express = require("express");
const router = express.Router({mergeParams: true});
const catchAsync = require("../utilities/catchAsync");
const {isLoggedIn, validateReview, isReviewAuthor} = require("../middleware");
const {postNewReview, deleteReview} = require("../controllers/reviewController");


router.post("/campgrounds/:id/reviews", isLoggedIn, validateReview, catchAsync(postNewReview));

router.delete("/campgrounds/:id/reviews/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(deleteReview));

module.exports = router;