import express from "express";
import { updateAnnouncement } from "../controllers/Admin_EditEventOrCelebrationController.js";

const router = express.Router();

router.put("/admin/announcementEdit/:id/:type", updateAnnouncement);

export default router;