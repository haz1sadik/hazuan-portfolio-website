import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { getCTFEvents, getCTFEventById, createCTFEvent, updateCTFEvent, deleteCTFEvent } from "../controllers/ctfEvent.controller.js";

const router = express.Router();

router.get("/", getCTFEvents);
router.get("/:id", getCTFEventById);
router.post("/", verifyToken, createCTFEvent);
router.put("/:id", verifyToken, updateCTFEvent);
router.delete("/:id", verifyToken, deleteCTFEvent);

export default router;