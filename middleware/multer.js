const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "image") {
      cb(null, "uploads/");
    } else if (file.fieldname === "document") {
      cb(null, "rules_doc/");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "image") {
    if (["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only images allowed"), false);
    }
  } else if (file.fieldname === "document") {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF allowed"), false);
    }
  }
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
