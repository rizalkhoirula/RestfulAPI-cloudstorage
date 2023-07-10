const mongoose = require("mongoose");
const ActivitiesSchema = mongoose.Schema(
  {
    Name: {
      type: String,
      required: [true, "pls field the Name"],
    },
    deskripsi: {
      type: String,
      required: true,
    },
    tanggal: {
      type: Date,
      default: Date.now,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Activities = mongoose.model("Activities", ActivitiesSchema);
module.exports = Activities;
