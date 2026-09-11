import mongoose from "mongoose";

const ngoSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  firebaseUid: String,
  regionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Region",
    required: true,
  },
  localLanguage: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ["ngo"],
    default: "ngo",
  },
  accountStatus: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});

const NGO = mongoose.model("NGO", ngoSchema);

export default NGO;
