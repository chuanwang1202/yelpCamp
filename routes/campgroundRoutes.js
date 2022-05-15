const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const {isLoggedIn, isAuthor, validateCampground} = require("../middleware");
const {home, index, postNewCampground, renderNewForm, showCampground, editCampground, updateCampground, deleteCampground} = require("../controllers/campgroundController");
const multer = require("multer");
const {storage} = require("../cloudinary/cloudinaryIndex");
const upload = multer({storage});

router.get("/home", home);

router.route("/campgrounds")
      .get(catchAsync(index))
      .post(isLoggedIn, validateCampground, upload.array("images"), catchAsync(postNewCampground));

router.get("/campgrounds/new", isLoggedIn, renderNewForm);

router.route("/campgrounds/:id")
      .get(catchAsync(showCampground))
      .put(isLoggedIn, isAuthor, upload.array("images"), validateCampground, catchAsync(updateCampground))
      .delete(isLoggedIn, isAuthor, catchAsync(deleteCampground));

router.get("/campgrounds/:id/edit", isLoggedIn, isAuthor, catchAsync(editCampground));

module.exports = router;