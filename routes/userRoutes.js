const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const passport = require("passport");
const {renderRegister, postRegister, renderLogin, postLogin, logout} = require("../controllers/userController");

router.get("/register",  renderRegister);

router.post("/register", catchAsync(postRegister));

router.get("/login",  renderLogin);

router.post("/login", passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), postLogin)

router.get("/logout",  logout);

module.exports = router;