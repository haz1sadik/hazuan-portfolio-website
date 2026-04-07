import expres from "express";
import adminRoutes from "./auth.route.js";

const router = expres.Router();

router.use("/admin", adminRoutes);

export default router;