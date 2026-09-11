import express from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getMyProfile,
  updateMyProfile,
  deactivateMyAccount,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";
// import { authorizeRoles } from "../middleware/roleMiddleware.js";
const router = express.Router();

router.get("/", protect, getUsers);

// router.get("/test-admin", protect, authorizeRoles("superadmin"), (req, res) => {
//   res.status(200).json({
//     message: "Welcome Super Admin",
//   });
// });
router.get("/me", protect, getMyProfile); //added here because/me is misunderstood as id --error
router.put("/me", protect, updateMyProfile);
router.patch("/me/deactivate", protect, deactivateMyAccount);
router.get("/:id", getUser);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
