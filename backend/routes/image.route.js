import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { getUploadUrl } from "../controllers/image.controller.js";

const router = express.Router();

// router.get("/upload-url", verifyToken, async (req, res) => {
//   const { fileName, contentType } = req.query;
//   if (!fileName || !contentType) {
//     return res.status(400).json({ error: "Missing fileName or contentType" });
//   }

//   try {
//     const url = await getUploadUrl(fileName, contentType);
//     res.json({ url });
//   } catch (error) {
//     console.error("Error generating upload URL:", error);
//     res.status(500).json({ error: "Failed to generate upload URL" });
//   }
// });

router.post("/upload-url", verifyToken, getUploadUrl);

export default router;