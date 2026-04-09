import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog } from "../controllers/blog.controller.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.post("/", verifyToken, createBlog);
router.put("/:id", verifyToken, updateBlog);
router.delete("/:id", verifyToken, deleteBlog);

export default router;