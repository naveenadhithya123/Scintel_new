import express from "express";
import upload from "../middleware/upload.js";
import { updateActivity } from "../controllers/Admin_UpdateEditActivityController.js";

const router = express.Router();

router.put(
  "/admin/activity/:id",
  upload.fields([
    { name: "brochure", maxCount: 1 },
    { name: "event_images", maxCount: 10 },
    { name: "winner_image", maxCount: 1 },
    { name: "resource_person_image", maxCount: 1 },
  ]),
  updateActivity
);

export default router;
