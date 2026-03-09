const Home = require("../models/homes");
const User = require("../models/user");

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

    let cart = []; //for cart
    let favouriteHomes = [];

    if (userId) {
      // for cart
      const user = await User.findById(userId);
      cart = user.cart.map((b) => b.toString());
      favouriteHomes = user.favourites.map((f) => f.toString());
    }
    res.render("store/homePage", {
      registeredHomes,
      pageTitle: "Home",
      cart,
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

exports.getCartController = async (req, res, next) => {
  //  for cart
  try {
    const userId = req.session.user._id;
    const user = await User.findById(userId).populate("cart");
    res.render("store/cart", {
      cart: user.cart,
      pageTitle: "Cart",
    });
  } catch (error) {
    console.log("Error while fetching Cart", error);
    res.render("store/cart", {
      pageTitle: "Cart",
      cart: [],
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

exports.postCartController = async (req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (user.cart.includes(homeId)) {
    console.log("Home Already in Cart.");
    return res.redirect("/store/cart");
  }
  user.cart.push(homeId);
  await user.save();
  res.redirect("/store/cart");
  console.log("Added to Cart.");
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

exports.getDeleteFromCartController = async (req, res, next) => {
  try {
    const homeId = req.params.homeId;
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    if (user.cart.includes(homeId)) {
      user.cart = user.cart.filter((booked) => booked != homeId);
      await user.save();
    }

    console.log("Deleted from Cart", homeId);
    res.redirect("/store/cart");
  } catch (error) {
    console.log("Error While Deleting From Cart ", error);
    res.redirect("/store/cart");
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

      // Redirect directly to Cloudinary PDF URL
      return res.redirect(home.document);
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  },
];
