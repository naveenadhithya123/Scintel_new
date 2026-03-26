import express from "express";
import multer from "multer";
import { updateActivity } from "../controllers/Admin_UpdateEditActivityController.js";

const router = express.Router();

// multer config (temporary storage)
const upload = multer({ dest: "uploads/" });

// multiple event images + single images
router.put(
  "/admin/activity/:id",
  upload.fields([
    { name: "event_images", maxCount: 10 },
    { name: "winner_image", maxCount: 1 },
    { name: "resource_person_image", maxCount: 1 },
  ]),
  updateActivity
);

export default router;