import asyncHandler from "express-async-handler";
import NGO from "../models/ngoModel.js";
import Region from "../models/regionModel.js";
import User from "../models/userModel.js";
import AssistanceRequest from "../models/assistanceReqModel.js";
import admin from "../config/firebaseAdmin.js";

// @desc    Onboard a new NGO
// @route   POST /api/ngos
// @access  Private/Super Admin

const createNGO = asyncHandler(async (req, res) => {
  const { name, email, phone, localLanguage, region, stateProvince, country } =
    req.body;

  const ngoExists = await NGO.findOne({ email });

  if (ngoExists) {
    res.status(400);
    throw new Error("NGO already exists");
  }

  // Find or create Firebase user
  let firebaseUser;

  try {
    firebaseUser = await admin.auth().getUserByEmail(email);
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      firebaseUser = await admin.auth().createUser({
        email,
      });
    } else {
      throw error;
    }
  }

  const firebaseUid = firebaseUser.uid;

  const regionDoc = await Region.findOne({
    region,
    stateProvince,
    country,
  });

  console.log("regionDoc =", regionDoc);

  if (!regionDoc) {
    res.status(404);
    throw new Error("Region not found");
  }

  // Create account record in users collection
  const user = await User.create({
    name,
    email,
    localLanguage,
    firebaseUid,
    role: "ngo",
    accountStatus: "active",
  });

  // Create NGO profile
  const ngo = await NGO.create({
    name,
    email,
    phone,
    localLanguage,
    regionId: regionDoc._id,
    firebaseUid,
    role: "ngo",
    accountStatus: "active",
  });

  res.status(201).json({
    user,
    ngo,
  });
});
// @desc    Get all NGOs
// @route   GET /api/ngos
// @access  Private/Super Admin
// const getNGOs = asyncHandler(async (req, res) => {
//   const ngos = await NGO.find();

//   res.status(200).json(ngos);
// });
const getNGOs = asyncHandler(async (req, res) => {
  console.log("req.query =", req.query);

  const { region } = req.query;

  if (region) {
    const regionDoc = await Region.findOne({ region });
    console.log("regionDoc =", regionDoc);
    if (!regionDoc) {
      res.status(404);
      throw new Error("Region not found");
    }

    const ngos = await NGO.find({
      regionId: regionDoc._id,
    }).populate("regionId");

    return res.status(200).json(ngos);
  }

  // const ngos = await NGO.find();
  const ngos = await NGO.find().populate("regionId");

  res.status(200).json(ngos);
});
// @desc    Get NGO by ID
// @route   GET /api/ngos/:id
// @access  Private/Super Admin
const getNGOById = async (req, res) => {
  try {
    const ngo = await NGO.findById(req.params.id).populate("regionId");

    if (!ngo) {
      return res.status(404).json({
        message: "NGO not found",
      });
    }

    res.status(200).json(ngo);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
// @desc Update NGO
// @route PUT /api/ngos/:id
// @access Private/Super Admin
const updateNGO = async (req, res) => {
  try {
    const { name, email, phone, regionId } = req.body;

    const ngo = await NGO.findById(req.params.id);

    if (!ngo) {
      return res.status(404).json({
        message: "NGO not found",
      });
    }

    // Update only the fields provided
    if (name !== undefined) ngo.name = name;
    if (email !== undefined) ngo.email = email;
    if (phone !== undefined) ngo.phone = phone;
    if (regionId !== undefined) ngo.regionId = regionId;

    const updatedNGO = await ngo.save();

    res.status(200).json(updatedNGO);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
/// @desc    Deactivate an NGO
// @route   PATCH /api/ngos/:id/deactivate
// @access  Private/Super Admin
const deactivateNGO = async (req, res) => {
  try {
    const ngo = await NGO.findById(req.params.id);

    if (!ngo) {
      return res.status(404).json({
        message: "NGO not found",
      });
    }

    // Update NGO collection
    ngo.accountStatus = "inactive";
    const updatedNGO = await ngo.save();

    // Update corresponding users collection record
    await User.findOneAndUpdate(
      { firebaseUid: ngo.firebaseUid },
      { accountStatus: "inactive" },
    );

    res.status(200).json({
      message: "NGO deactivated successfully",
      ngo: updatedNGO,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
// @desc    Activate an NGO
// @route   PATCH /api/ngos/:id/activate
// @access  Private/Super Admin
const activateNGO = async (req, res) => {
  try {
    const ngo = await NGO.findById(req.params.id);

    if (!ngo) {
      return res.status(404).json({
        message: "NGO not found",
      });
    }

    // Update NGO collection
    ngo.accountStatus = "active";
    const updatedNGO = await ngo.save();

    // Update corresponding users collection record
    await User.findOneAndUpdate(
      { firebaseUid: ngo.firebaseUid },
      { accountStatus: "active" },
    );

    res.status(200).json({
      message: "NGO activated successfully",
      ngo: updatedNGO,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
// @desc    Delete an NGO
// @route   DELETE /api/ngos/:id
// @access  Private/Super Admin
const deleteNGO = async (req, res) => {
  try {
    // Find NGO
    const ngo = await NGO.findById(req.params.id);

    if (!ngo) {
      return res.status(404).json({
        message: "NGO not found",
      });
    }

    const firebaseUid = ngo.firebaseUid;

    // Delete NGO from ngos collection
    await NGO.findByIdAndDelete(req.params.id);

    // Delete corresponding user from users collection
    await User.findOneAndDelete({
      firebaseUid,
    });

    // Delete corresponding Firebase Authentication user
    try {
      await admin.auth().deleteUser(firebaseUid);
    } catch (error) {
      console.error("Firebase user deletion error:", error);
    }

    res.status(200).json({
      message: "NGO deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
// @desc    Get all Users belonging to the NGO's region
// @route   GET /api/ngos/users
// @access  Private/NGO

const getNGOUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: "user",
      regionId: req.ngo.regionId,
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get logged-in NGO profile
// @route   GET /api/ngos/me
// @access  Private/NGO
const getMyNGOProfile = async (req, res) => {
  try {
    const ngo = await NGO.findOne({
      firebaseUid: req.firebaseUser.uid,
    }).populate("regionId", "region stateProvince country");

    if (!ngo) {
      return res.status(404).json({
        message: "NGO profile not found",
      });
    }

    res.status(200).json(ngo);
  } catch (error) {
    console.error("Error fetching NGO profile:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get assistance requests belonging to the NGO's region
// @route   GET /api/ngos/assistance-requests
// @access  Private/NGO
const getNGOAssistanceRequests = async (req, res) => {
  try {
    const requests = await AssistanceRequest.find({
      regionId: req.ngo.regionId,
    })
      .populate("userId", "name age gender phone localLanguage skills")
      .populate("regionId", "region stateProvince country")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching NGO assistance requests:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export {
  createNGO,
  getNGOs,
  getNGOById,
  updateNGO,
  deactivateNGO,
  activateNGO,
    deleteNGO,
  getNGOUsers,
  getMyNGOProfile,
  getNGOAssistanceRequests,
};
