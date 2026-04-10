import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { getCTFWriteups, getCTFWriteupById, getCTFWriteupsByEvent, createCTFWriteup, updateCTFWriteup, deleteCTFWriteup } from "../controllers/ctfWriteup.controller.js"

const router = express.Router();

router.get("/", getCTFWriteups);
router.get("/:id", getCTFWriteupById);
router.get("/events/:eventId", getCTFWriteupsByEvent);
router.post("/", verifyToken, createCTFWriteup);
router.put("/:id", verifyToken, updateCTFWriteup);
router.delete("/:id", verifyToken, deleteCTFWriteup);

export default router;