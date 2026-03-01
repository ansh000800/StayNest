const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    if (file.fieldname === "image") {
      return {
        folder: "airbnb-app/images",
        allowed_formats: ["jpg", "jpeg", "png"],
      };
    }

    if (file.fieldname === "document") {
      return {
        folder: "airbnb-app/documents",
        resource_type: "raw",
        format: "pdf",
      };
    }
  },
});

const upload = multer({ storage });

module.exports = upload;
