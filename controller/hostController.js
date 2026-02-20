const path = require("path");
const Home = require("../models/homes");
const fs = require("fs");

exports.getAddHomeController = (req, res, next) => {
  res.render("host/addHome", {
    pageTitle: "Add Home",
    editing: false,
  });
};

exports.postAddHomeController = (req, res, next) => {
  const imageFile = req.files?.image?.[0];
  const documentFile = req.files?.document?.[0];

  if (!imageFile) {
    return res.status(400).send("Please upload a valid image (jpg, jpeg, png)");
  }

  console.log(req.files);

  const imagePath = imageFile.filename;
  const documentPath = documentFile ? documentFile.filename : null;
  const home = new Home({
    houseName: req.body.homeName,
    rent: req.body.rent,
    image: imagePath,
    document: documentPath,
    location: req.body.location,
    rating: req.body.rating,
    description: req.body.description,
    host: req.session.user._id, //host id
  });

  home.save().then(() => {
    console.log("Home Added Successfully");
    res.render("host/homeAdded", {
      pageTitle: "Home Added",
    });
  });
};

exports.getHomeListController = (req, res, next) => {
  const hostId = req.session.user._id;
  Home.find({ host: hostId }).then((registeredHomes) => {
    res.render("host/home-list", {
      registeredHomes,
      pageTitle: "Host Home List",
    });
  });
};

exports.getEditHomeController = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";
  const hostId = req.session.user._id;

  Home.findOne({ _id: homeId, host: hostId }).then((home) => {
    if (!home) {
      console.log("Home Not Found For Editing.");
      return res.redirect("/host/home-list");
    } else {
      res.render("host/addHome", {
        home: home,
        pageTitle: "Edit Home",
        editing: editing,
      });
    }
  });
};

exports.postEditHomeControlller = (req, res, next) => {
  const { id, homeName, rent, location, rating, description } = req.body;
  const imageFile = req.files?.image?.[0];
  const documentFile = req.files?.document?.[0];
  const hostId = req.session.user._id; //1
  Home.findOne({ _id: id, host: hostId }) //2
    .then((home) => {
      home.houseName = homeName;
      home.rent = rent;
      home.location = location;
      home.rating = rating;
      home.description = description;
      if (imageFile) {
        const oldImage = path.join("uploads", home.image);
        fs.unlink(oldImage, (err) => {
          if (err) {
            console.log("Error while deleting old image", err);
          }
        });
        home.image = imageFile.filename;
      }
      if (documentFile) {
        const oldDocument = path.join("rules_doc", home.document);
        fs.unlink(oldDocument, (err) => {
          console.log("Error while deleting the Old Document", err);
        });
        home.document = documentFile.filename;
      }
      home
        .save()
        .then((result) => {
          console.log("Home Updated Successfully", result);
        })
        .catch((err) => {
          console.log("Error while Updating Home", err);
        });
      res.redirect("/host/home-list");
    })
    .catch((err) => {
      console.log("Error while Finding Home for Update", err);
      res.redirect("/host/home-list");
    });
};

exports.postDeleteHomeController = (req, res, next) => {
  const homeId = req.params.homeId;
  const hostId = req.session.user._id;
  console.log("came to delete home", homeId);
  Home.findOneAndDelete({ _id: homeId, host: hostId })
    .then(() => {
      console.log("Home Deleted Successfully", homeId);
      res.redirect("/host/home-list");
    })
    .catch((err) => {
      console.log("Error while Deleting Home", err);
      res.redirect("/host/home-list");
    });
};
