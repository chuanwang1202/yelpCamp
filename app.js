if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const campgroundRoute = require("./routes/campgroundRoutes");
const reviewRoute = require("./routes/reviewRoutes");
const userRoute = require("./routes/userRoutes");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");
const ExpressError = require("./utilities/expressError");
const mongoSanitize =require("express-mongo-sanitize");
const helmet = require("helmet");


//const dbURL = process.env.DB_URL;
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelpCamp';
mongoose.connect(dbUrl, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(
    () => {
        console.log("Mongo Connected");
    }
)
.catch(err => {
    console.log("Error");
    console.log(err);
})

app.use(mongoSanitize({
    replaceWith: "_"
}));
const secret = process.env.SECRET || "secretstrings";
const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'squirrel'
    }
});
store.on("err", function(e) {
    console.log("Session Store Error!")
})
const sessionConfig = {
    store,
    name: "yelp",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    if (!["/", "/login"].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }
    res.locals.user = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})
app.use(campgroundRoute);
app.use(reviewRoute);
app.use(userRoute);

app.all("*", (req, res, next) =>{
    next(new ExpressError("Page Not Found!", 404));
})

app.use((err, req, res, next) => {
    const {message = "Sth is Wrong!", status = 500} = err;
    res.status(status).render("error", {message, status});
    }
)
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Connected on port ${port}`);
})