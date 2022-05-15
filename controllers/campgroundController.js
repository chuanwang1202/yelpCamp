const Campground = require("../models/campgound");
const flash = require("connect-flash");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const {cloudinary} = require("../cloudinary/cloudinaryIndex");

module.exports.home = (req, res) => {
    res.render("home");
}

module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds});
}

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
}

module.exports.postNewCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1,
    }).send();
    const newCampground = new Campground(req.body);
    newCampground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    newCampground.author = req.user._id;
    newCampground.geometry = geoData.body.features[0].geometry;
    await newCampground.save();
    req.flash("success", "Successfully Made a New Campground!");
    res.redirect(`campgrounds/${newCampground.id}`);
}

module.exports.showCampground = async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).populate({
        path: "reviews", populate:{path: "author"}
    }).populate("author");
    if (!campground) {
        req.flash("error", "Can not Find This Campground!")
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", {campground});
}

module.exports.editCampground = async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", {campground});
}

module.exports.updateCampground = async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body, {runValidators: true});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.images.push(...imgs);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    await campground.save();
    req.flash("success", `Successfully Updated ${campground.name}!`);
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res, next) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully Deleted the Campground!");
    res.redirect("/campgrounds");
}