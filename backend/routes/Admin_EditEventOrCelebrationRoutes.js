import express from "express";
import upload from "../middleware/upload.js";
import { updateAnnouncement } from "../controllers/Admin_EditEventOrCelebrationController.js";

const router = express.Router();

router.put(
  "/admin/announcementEdit/:id/:type",
  upload.single("file"),
  updateAnnouncement
);



export default router;
