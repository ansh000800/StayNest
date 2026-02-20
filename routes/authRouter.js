const express = require("express");
const {
  getLogInController,
  postLogInController,
  postLogOutController,
  getSignUpController,
  postSignUpController,
} = require("../controller/authController");

const authRouter = express.Router();

authRouter.get("/login", getLogInController);

authRouter.post("/login", postLogInController);
authRouter.post("/logout", postLogOutController);

authRouter.get("/signup", getSignUpController);
exports.authRouter = authRouter;

authRouter.post("/signup", postSignUpController);
