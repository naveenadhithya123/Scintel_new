import express from "express";
import { getAdminAnnouncementFeed } from "../controllers/Admin_AnnouncementPageFetchController.js";

const router = express.Router();

router.get("/admin/announcements", getAdminAnnouncementFeed);

export default router;