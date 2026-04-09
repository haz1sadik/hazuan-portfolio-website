import expres from "express";
import adminRoutes from "./auth.route.js";
import blogRoutes from "./blog.route.js";

const router = expres.Router();

router.use("/admin", adminRoutes);
router.use("/blogs", blogRoutes);

export default router;