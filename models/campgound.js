const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const User = require("./user");

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = {toJSON:{virtuals: true}};

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    location: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
         type: mongoose.Schema.Types.ObjectId, ref: "User"
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Review"
    }]
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<a href = "/campgrounds/${this._id}">${this.title}<a>`;
});

CampgroundSchema.post("findOneAndDelete", async campground =>{
    if (campground) {
        await Review.deleteMany({_id:{$in: campground.reviews}});
    }
})

module.exports = mongoose.model("Campground", CampgroundSchema);