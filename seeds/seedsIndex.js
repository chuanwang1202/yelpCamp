const mongoose = require("mongoose");
const Campground = require("../models/campgound");
const cities = require("./cities");
const {places, descriptors} = require("./seedHelper");
mongoose.connect('mongodb://localhost:27017/yelpCamp', {useNewUrlParser: true, useUnifiedTopology: true}).then(
    () => {
        console.log("Mongo Connected");
    }
)
.catch(err => {
    console.log("Error");
    console.log(err);
})
const sample = arr => arr[Math.floor(Math.random()*arr.length)]
const seedDb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random()*1000);
        const Price = Math.floor(Math.random()*20 + 10);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)}, ${sample(places)}`,
            price: Price,
            author: "6279233a8300c5977af6159c",
            geometry: {
                type: "Point",
                coordinates: [`${cities[random1000].longitude}`, `${cities[random1000].latitude}`]
            },
            images: [{url: 'https://res.cloudinary.com/dguxvuxn8/image/upload/v1652351977/YelpCamp/q8youkwe3szicurho5uu.jpg',
                filename: 'YelpCamp/q8youkwe3szicurho5uu'},
                {url: 'https://res.cloudinary.com/dguxvuxn8/image/upload/v1652351977/YelpCamp/bcnbsoh5g4clbicgx1vp.jpg',
                filename: 'YelpCamp/bcnbsoh5g4clbicgx1vp'}]
        });
        await camp.save()
    }
}
seedDb();