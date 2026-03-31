import express from "express";
import { getAdminAnnouncementFeed } from "../controllers/Admin_AnnouncementPageFetchController.js";
import { getSpecificAnnouncement } from "../controllers/Admin_FetchSpecificEventOrCelebrationController.js";

const router = express.Router();

router.get("/announcements", getAdminAnnouncementFeed);
router.get("/announcement/:id/:type", getSpecificAnnouncement);

export default router;
