exports.homePageController = (req, res, next) => {
  console.log("session value", req.session);

  res.render("store/index", {
    pageTitle: "Airbnb",
  });
};
