import asyncHandler from "express-async-handler";
import Region from "../models/regionModel.js";

// @desc    Get all regions
// @route   GET /api/regions
// @access  Public
const getRegions = asyncHandler(async (req, res) => {
  const regions = await Region.find();

  res.status(200).json(regions);
});

// @desc    Get single region
// @route   GET /api/regions/:id
// @access  Public
const getRegion = asyncHandler(async (req, res) => {
  const region = await Region.findById(req.params.id);

  if (!region) {
    res.status(404);
    throw new Error("Region not found");
  }

  res.status(200).json(region);
});

export { getRegions, getRegion };

