import mongoose from "mongoose";

const regionSchema = new mongoose.Schema(
  {
      region: {
      type: String,
      required: true,
      trim: true,
    },

    stateProvince: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Region = mongoose.model("Region", regionSchema);

export default Region;
