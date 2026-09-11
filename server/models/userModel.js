import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: function () {
        return this.role === "user";
      },
      min: 0,
    },

    gender: {
      type: String,
      required: function () {
        return this.role === "user";
      },
      enum: ["Male", "Female", "Other"],
    },

    phone: {
      type: String,
      required: function () {
        return this.role === "user";
      },
      trim: true,
    },

    localLanguage: {
      type: String,
      required: true,
      trim: true,
    },

    regionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region",
      required: function () {
        return this.role === "user";
      },
    },
    region: {
      type: String,
      trim: true,
      required: function () {
        return this.role === "user";
      },
    },

    stateProvince: {
      type: String,
      trim: true,
      required: function () {
        return this.role === "user";
      },
    },

    country: {
      type: String,
      trim: true,
      required: function () {
        return this.role === "user";
      },
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },

    accountStatus: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    role: {
      type: String,
      enum: ["user", "ngo", "superadmin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
