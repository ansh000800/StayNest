exports.ErrorController = (req, res, next) => {
  res
    .status(404)
    .render("404_Page", { pageTitle: "Error 404", isLoggedIn: req.isLoggedIn });
};
