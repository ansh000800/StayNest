const express = require("express"); //external module

const {
  homePageController,
  airbnbHomeController,
  getHomeDetailsController,
  postAddFavouritesController,
  getFavouritesController,
  postBookingController,
  getBookingsController,
  postFavDeleteController,
  getDeleteFromBookingsController,
  getHouseRules,
} = require("../controller/storeController");

const storeRouter = express.Router(); //cretaing the userRouter an app/server using the router functioin of express to use the router parsing .

storeRouter.get("/", homePageController);
storeRouter.get("/home", airbnbHomeController);
storeRouter.get("/favourites", getFavouritesController);
storeRouter.get("/bookings", getBookingsController);
storeRouter.get("/home/:homeId", getHomeDetailsController);

storeRouter.post("/favourites", postAddFavouritesController);

storeRouter.post("/bookings", postBookingController);

storeRouter.post("/delete-fav/:homeId", postFavDeleteController);

storeRouter.get("/delete-home/:homeId", getDeleteFromBookingsController);
storeRouter.get("/rules/:homeId", getHouseRules);

exports.storeRouter = storeRouter;
