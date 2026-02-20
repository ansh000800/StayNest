const mongoose = require("mongoose");

const homeSchema = mongoose.Schema({
  houseName: {
    type: String,
    required: true,
  },
  rent: {
    type: Number,
    required: true,
  },
  image: String,
  document: String,
  location: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  description: String,
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required:true,
  },
});

// 🔥 Middleware: runs BEFORE home is deleted
// homeSchema.pre("findOneAndDelete", async function (next) {
//   try {
//     const home = await this.model.findOne(this.getFilter());

//     if (home) {
//       await Bookings.deleteMany({ houseId: home._id });
//       await Favourites.deleteMany({ houseId: home._id });

//       console.log("Related Bookings & Favourites deleted automatically");
//     }
//   } catch (err) {
//     console.log("Error in pre-delete middleware", err);
//   }
// });

module.exports = mongoose.model("Home", homeSchema);
