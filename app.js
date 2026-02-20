// external module
const express = require("express");
const dns = require("dns");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

require("dotenv").config();

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const DB_Path = process.env.MONGO_URL;

//importing router
const { storeRouter } = require("./routes/storeRouter");
const { hostRouter } = require("./routes/hostRouter");
const { authRouter } = require("./routes/authRouter");

const path = require("path");

const rootDir = require("./utils/pathUtils");

const { ErrorController } = require("./controller/404Controller");
const { default: mongoose } = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(rootDir, "views"));

const store = new MongoDBStore({
  uri: DB_Path,
  collection: "sessions",
});

//global middlewares.
app.use(
  session({
    secret: process.env.SESSION_SECRET, // this is a secret key used to sign the session ID cookie. It should be a random string and kept secure in a production environment.

    resave: false, // this option forces the session to be saved back to the session store, even if it was never modified during the request. Setting it to false can help reduce unnecessary session saves.

    saveUninitialized: false, // this option forces a session that is "uninitialized" to be saved to the store. An uninitialized session is one that is new but not modified. Setting it to true can be useful for implementing login sessions, reducing server storage usage, or complying with laws that require permission before setting a cookie.

    store: store, // this option specifies the session store instance to use for storing session data. In this case, we are using a MongoDB store created with connect-mongodb-session.
  }),
);

app.use(express.static(path.join(rootDir, "public")));
app.use("/uploads", express.static("uploads"));
app.use("/rules_doc", express.static("rules_doc"));

app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.user = req.session.user;
  next();
});

app.use((req, res, next) => {
  res.locals.currentPath = req.originalUrl;
  next();
});

//router parsing use;
app.use(authRouter);
app.use("/store", storeRouter);
app.use("/host", (req, res, next) => {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
});
app.use("/host", hostRouter);

//404 page handling
app.use(ErrorController);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB successfully.");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });
