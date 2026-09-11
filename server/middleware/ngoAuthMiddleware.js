import asyncHandler from "express-async-handler";
import NGO from "../models/ngoModel.js";

const protectNGO = asyncHandler(async (req, res, next) => {
  const ngo = await NGO.findOne({
    firebaseUid: req.user.firebaseUid,
  });

  if (!ngo) {
    res.status(404);
    throw new Error("NGO profile not found");
  }

  if (ngo.accountStatus !== "active") {
    res.status(403);
    throw new Error("NGO account is inactive");
  }

  req.ngo = ngo;

  next();
});

export { protectNGO };
