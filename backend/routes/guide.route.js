import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { getGuides, getGuideById, createGuide, updateGuide, deleteGuide } from "../controllers/guide.controller.js";

const router = express.Router();

router.get("/", getGuides);
router.get("/:id", getGuideById);
router.post("/", verifyToken, createGuide);
router.put("/:id", verifyToken, updateGuide);
router.delete("/:id", verifyToken, deleteGuide);

export default router;