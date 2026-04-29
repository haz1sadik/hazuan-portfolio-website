import expres from "express";
import adminRoutes from "./auth.route.js";
import blogRoutes from "./blog.route.js";
import guideRoutes from "./guide.route.js";
import ctfEventRoutes from "./ctfEvent.route.js";
import ctfWriteupRoutes from "./ctfWriteup.route.js";
import imageRoutes from "./image.route.js"

const router = expres.Router();

router.use("/admin", adminRoutes);
router.use("/blogs", blogRoutes);
router.use("/guides", guideRoutes);
router.use("/ctf-events", ctfEventRoutes);
router.use("/ctf-writeups", ctfWriteupRoutes);
router.use("/images", imageRoutes);

export default router;