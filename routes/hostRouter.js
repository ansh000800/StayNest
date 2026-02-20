const express = require("express"); //external module
const upload = require("../middleware/multer");

const {
  getAddHomeController,
  postAddHomeController,
  getHomeListController,
  getEditHomeController,
  postEditHomeControlller,
  postDeleteHomeController,
} = require("../controller/hostController");

const hostRouter = express.Router(); //cretaing the hostRouter an app/server using the router functioin of express to use the router parsing .

hostRouter.get("/add-home", getAddHomeController);

hostRouter.post(
  "/add-home",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  postAddHomeController,
);

hostRouter.get("/home-list", getHomeListController);

hostRouter.get("/edit-home/:homeId", getEditHomeController);

hostRouter.post(
  "/edit-home",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  postEditHomeControlller,
);

hostRouter.post("/delete-home/:homeId", postDeleteHomeController);

exports.hostRouter = hostRouter;
