import express from "express";
import { protectNGO } from "../middleware/ngoAuthMiddleware.js";
import {
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
} from "../controllers/ngoController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("superadmin"), createNGO);
router.get("/", protect, authorizeRoles("superadmin"), getNGOs);
router.get("/users", protect, authorizeRoles("ngo"), protectNGO, getNGOUsers);
router.get(
  "/assistance-requests",
  protect,
  authorizeRoles("ngo"),
  protectNGO,
  getNGOAssistanceRequests,
);

router.get("/me", protect, authorizeRoles("ngo"), protectNGO, getMyNGOProfile);

router.get("/:id", protect, authorizeRoles("superadmin"), getNGOById);
router.put("/:id", protect, authorizeRoles("superadmin"), updateNGO);
router.patch(
  "/:id/deactivate",
  protect,
  authorizeRoles("superadmin"),
  deactivateNGO,
);
router.patch(
  "/:id/activate",
  protect,
  authorizeRoles("superadmin"),
  activateNGO,
);
router.delete("/:id", protect, authorizeRoles("superadmin"), deleteNGO);
export default router;
