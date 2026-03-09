const express = require("express"); //external module

const {
  airbnbHomeController,
  getHomeDetailsController,
  postAddFavouritesController,
  getFavouritesController,
  postCartController,
  getCartController,
  postFavDeleteController,
  getDeleteFromCartController,
  getHouseRules,
  homePageController,
} = require("../controller/storeController");

const storeRouter = express.Router(); //cretaing the userRouter an app/server using the router functioin of express to use the router parsing .

storeRouter.get("/", homePageController);
storeRouter.get("/home", airbnbHomeController);
storeRouter.get("/favourites", getFavouritesController);
storeRouter.get("/cart", getCartController);
storeRouter.get("/home/:homeId", getHomeDetailsController);

storeRouter.post("/favourites", postAddFavouritesController);

storeRouter.post("/cart", postCartController);

storeRouter.post("/delete-fav/:homeId", postFavDeleteController);

storeRouter.get("/delete-home/:homeId", getDeleteFromCartController);
storeRouter.get("/rules/:homeId", getHouseRules);

exports.storeRouter = storeRouter;
