import express from "express";
import { login, logout, getAllAdmins, refresh } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/admins", verifyToken, getAllAdmins);

export default router;