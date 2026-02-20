const Home = require("../models/homes");
const User = require("../models/user");
const path = require("path");
const rootDir = require("../utils/pathUtils");

exports.homePageController = (req, res, next) => {
  console.log("session value", req.session);

  res.render("store/index", {
    pageTitle: "Airbnb",
  });
};

exports.airbnbHomeController = async (req, res, next) => {
  try {
    const registeredHomes = await Home.find();
    const userId = req.session.user?._id;

    let bookedHomes = [];
    let favouriteHomes = [];

    if (userId) {
      const user = await User.findById(userId);
      bookedHomes = user.bookings.map((b) => b.toString());
      favouriteHomes = user.favourites.map((f) => f.toString());
    }
    res.render("store/homePage", {
      registeredHomes,
      pageTitle: "Home",
      bookedHomes,
      favouriteHomes,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/store/home");
  }
};

exports.getFavouritesController = async (req, res, next) => {
  try {
    const userId = req.session.user._id;
    const user = await User.findById(userId).populate("favourites");
    res.render("store/favourite-list", {
      pageTitle: "Favourites",
      favouriteHomes: user.favourites,
    });
  } catch (error) {
    console.log("Error while fetching Favourites", error);
    res.render("store/favourite-list", {
      pageTitle: "Favourites",
      favouriteHomes: [],
    });
  }
};

exports.getBookingsController = async (req, res, next) => {
  try {
    const userId = req.session.user._id;
    const user = await User.findById(userId).populate("bookings");
    res.render("store/bookings", {
      bookedHomes: user.bookings,
      pageTitle: "Bookings",
    });
  } catch (error) {
    console.log("Error while fetching Bookings", error);
    res.render("store/bookings", {
      pageTitle: "Bookings",
      bookedHomes: [],
    });
  }
};

exports.getHomeDetailsController = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home Not Found.");
      res.redirect("/store/home");
    } else {
      res.render("store/home-details", {
        pageTitle: "Home-Details",
        home: home,
      });
    }
  });
};

exports.postAddFavouritesController = async (req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (!user.favourites.includes(homeId)) {
    user.favourites.push(homeId);
    await user.save();
  }
  res.redirect("/store/home");
  console.log("Added to favourites:", homeId);
};

exports.postBookingController = async (req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (user.bookings.includes(homeId)) {
    console.log("Home Already Booked.");
    return res.redirect("/store/bookings");
  }
  user.bookings.push(homeId);
  await user.save();
  res.redirect("/store/bookings");
  console.log("Home Booked SucessFully");
};

exports.postFavDeleteController = async (req, res, next) => {
  try {
    const homeId = req.params.homeId;
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    if (user.favourites.includes(homeId)) {
      user.favourites = user.favourites.filter((fav) => fav != homeId);
      await user.save();
    }
    console.log("Deleted from Favourites", homeId);
    res.redirect("/store/favourites");
  } catch (error) {
    console.log("Error while Deleting from Favourites", error);
    res.redirect("/store/favourites");
  }
};

exports.getDeleteFromBookingsController = async (req, res, next) => {
  try {
    const homeId = req.params.homeId;
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    if (user.bookings.includes(homeId)) {
      user.bookings = user.bookings.filter((booked) => booked != homeId);
      await user.save();
    }

    console.log("Deleted from bookings", homeId);
    res.redirect("/store/bookings");
  } catch (error) {
    console.log("Error While Deleting From Bookings ", error);
    res.redirect("/store/bookings");
  }
};

exports.getHouseRules = [
  (req, res, next) => {
    if (!req.session.isLoggedIn) {
      return res.redirect("/login");
    }
    next();
  },

  async (req, res, next) => {
    try {
      const homeId = req.params.homeId;

      const home = await Home.findById(homeId);

      if (!home || !home.document) {
        return res.status(404).send("No rules document found");
      }

      const filePath = path.join(rootDir, "rules_doc", home.document);

      res.download(filePath, home.document);
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  },
];
