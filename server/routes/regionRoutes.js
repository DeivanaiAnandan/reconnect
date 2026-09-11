
import express from "express";
import { getRegions, getRegion } from "../controllers/regionController.js";

const router = express.Router();

router.get("/", getRegions);
router.get("/:id", getRegion);

export default router;

