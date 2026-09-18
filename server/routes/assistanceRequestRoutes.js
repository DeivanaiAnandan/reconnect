import express from "express";

import {
  createAssistanceRequest,
  getMyAssistanceRequests,
  getAllAssistanceRequests,
  updateAssistanceRequestStatus,
} from "../controllers/assistanceRequestController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// User creates an assistance request
router.post("/", protect, createAssistanceRequest);

// User views their own assistance requests
router.get("/my", protect, getMyAssistanceRequests);

// Super Admin views all assistance requests
router.get(
  "/",
  protect,
  authorizeRoles("superadmin"),
  getAllAssistanceRequests,
);

// Super Admin updates assistance request status
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("superadmin"),
  updateAssistanceRequestStatus,
);

export default router;
