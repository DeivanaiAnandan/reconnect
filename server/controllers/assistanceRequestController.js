import AssistanceRequest from "../models/assistanceReqModel.js";
import User from "../models/userModel.js";

export const createAssistanceRequest = async (req, res) => {
  try {
    // Firebase UID comes from the protect middleware
    const firebaseUid = req.firebaseUser.uid;

    // Find the logged-in user in MongoDB
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        message: "User profile not found",
      });
    }

    // Only normal users can submit assistance requests
    if (user.role !== "user") {
      return res.status(403).json({
        message: "Only users can submit assistance requests",
      });
    }

    const { assistanceType, description } = req.body;

    // Validate assistance type
    if (!Array.isArray(assistanceType) || assistanceType.length === 0) {
      return res.status(400).json({
        message: "At least one assistance type is required",
      });
    }

    // Create the assistance request
    const assistanceRequest = await AssistanceRequest.create({
      userId: user._id,
      regionId: user.regionId,
      assistanceType,
      description,
      status: "Pending",
    });

    res.status(201).json({
      message: "Assistance request submitted successfully",
      request: assistanceRequest,
    });
  } catch (error) {
    console.error("Error creating assistance request:", error);

    res.status(500).json({
      message: "Failed to create assistance request",
    });
  }
};

export const getMyAssistanceRequests = async (req, res) => {
  try {
    const firebaseUid = req.firebaseUser.uid;

    // Find the logged-in user
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        message: "User profile not found",
      });
    }

    // Find all assistance requests created by this user
    const requests = await AssistanceRequest.find({
      userId: user._id,
    })
      .populate("regionId", "region stateProvince country")
      .sort({ createdAt: -1 });

    res.status(200).json({
      requests,
    });
  } catch (error) {
    console.error("Error fetching assistance requests:", error);

    res.status(500).json({
      message: "Failed to fetch assistance requests",
    });
  }
};

export const getAllAssistanceRequests = async (req, res) => {
  try {
    const requests = await AssistanceRequest.find()
      .populate("userId", "name age gender phone localLanguage skills")
      .populate("regionId", "region stateProvince country")
      .sort({ createdAt: -1 });

    res.status(200).json({
      requests,
    });
  } catch (error) {
    console.error("Error fetching all assistance requests:", error);

    res.status(500).json({
      message: "Failed to fetch assistance requests",
    });
  }
};

export const updateAssistanceRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["Pending", "In Progress", "Resolved"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Status must be Pending, In Progress, or Resolved",
      });
    }

    const request = await AssistanceRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        message: "Assistance request not found",
      });
    }

    request.status = status;

    const updatedRequest = await request.save();

    res.status(200).json({
      message: "Assistance request status updated successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Error updating assistance request status:", error);

    res.status(500).json({
      message: "Failed to update assistance request status",
    });
  }
};
