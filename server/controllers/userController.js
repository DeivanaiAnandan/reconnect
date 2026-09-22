import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Region from "../models/regionModel.js";
import admin from "../config/firebaseAdmin.js";

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({ role: "user" });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});

// @desc    Create a new user
// @route   POST /api/users
// @access  Public
const createUser = asyncHandler(async (req, res) => {
  const {
    name,
    age,
    gender,
    phone,
    localLanguage,
    region,
    stateProvince,
    country,
    email,
    skills,
    firebaseUid,
  } = req.body;

  // Check whether user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Find the Region using the region provided by the user
  const regionDoc = await Region.findOne({
    region,
    stateProvince,
    country,
  });

  if (!regionDoc) {
    res.status(404);
    throw new Error("Region not found");
  }

  // Create user
  const user = await User.create({
    name,
    age,
    gender,
    phone,
    localLanguage,

    regionId: regionDoc._id,
    region: regionDoc.region,

    stateProvince,
    country,
    email,
    skills,
    firebaseUid,

    role: "user",
    accountStatus: "active",
  });

  res.status(201).json(user);
});
// @desc    Update user
// @route   PUT /api/users/:id
// @access  Public
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const {
    name,
    age,
    gender,
    phone,
    localLanguage,
    region,
    stateProvince,
    country,
    email,
    skills,
  } = req.body;

  // If region details are being changed
  if (region || stateProvince || country) {
    const regionDoc = await Region.findOne({
      region: region || user.region,
      stateProvince: stateProvince || user.stateProvince,
      country: country || user.country,
    });

    if (!regionDoc) {
      res.status(404);
      throw new Error("Region not found");
    }

    user.regionId = regionDoc._id;
    user.region = regionDoc.region;
  }

  user.name = name ?? user.name;
  user.age = age ?? user.age;
  user.gender = gender ?? user.gender;
  user.phone = phone ?? user.phone;
  user.localLanguage = localLanguage ?? user.localLanguage;
  user.stateProvince = stateProvince ?? user.stateProvince;
  user.country = country ?? user.country;
  user.email = email ?? user.email;
  user.skills = skills ?? user.skills;

  const updatedUser = await user.save();

  res.status(200).json(updatedUser);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Public
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Delete Firebase Authentication account
  await admin.auth().deleteUser(user.firebaseUid);

  // Delete user from MongoDB
  await user.deleteOne();

  res.status(200).json({
    message: "User deleted successfully",
  });
});
// @desc    Get logged-in user's profile
// @route   GET /api/users/me
// @access  Private
const getMyProfile = asyncHandler(async (req, res) => {
  try {
    const user = req.user;

    const profileComplete =
      user.role === "user" &&
      user.age != null &&
      user.gender &&
      user.phone &&
      user.localLanguage &&
      user.regionId &&
      user.region &&
      user.stateProvince &&
      user.country;

    res.status(200).json({
      profile: user,
      profileComplete: Boolean(profileComplete),
      role: user.role,
    });
  } catch (error) {
    console.error("Error getting my profile:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// @desc    Update logged-in user's profile
// @route   PUT /api/users/me
// @access  Private
const updateMyProfile = asyncHandler(async (req, res) => {
  try {
    const user = req.user;

    const {
      name,
      age,
      gender,
      phone,
      localLanguage,
      region,
      stateProvince,
      country,
      email,
      skills,
    } = req.body;

    // Check whether location details are being changed
    if (region || stateProvince || country) {
      const regionDoc = await Region.findOne({
        region: region || user.region,
        stateProvince: stateProvince || user.stateProvince,
        country: country || user.country,
      });

      if (!regionDoc) {
        res.status(404);
        throw new Error("Region not found");
      }

      user.regionId = regionDoc._id;
      user.region = regionDoc.region;
      user.stateProvince = regionDoc.stateProvince;
      user.country = regionDoc.country;
    }

    // Update profile fields
    user.name = name ?? user.name;
    user.age = age ?? user.age;
    user.gender = gender ?? user.gender;
    user.phone = phone ?? user.phone;
    user.localLanguage = localLanguage ?? user.localLanguage;
    user.email = email ?? user.email;
    user.skills = skills ?? user.skills;

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});
// @desc    Deactivate logged-in user's account
// @route   PATCH /api/users/me/deactivate
// @access  Private
const deactivateMyAccount = asyncHandler(async (req, res) => {
  const user = req.user;

  user.accountStatus = "inactive";

  await user.save();

  res.status(200).json({
    message: "Account deactivated successfully",
  });
});
export {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getMyProfile,
  updateMyProfile,
  deactivateMyAccount,
};
