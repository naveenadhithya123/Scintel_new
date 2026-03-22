import express from "express";
import multer from "multer";
import { updateActivity } from "../controllers/Admin_UpdateEditActivityController.js";

const router = express.Router();

// multer config (temporary storage)
const upload = multer({ dest: "uploads/" });

// multiple event images + single images
// backend/routes/admin_routes.js
router.put(
  "/admin/activity/:id",
  upload.fields([
    // Actual Files
    { name: "brochure", maxCount: 1 },
    { name: "resource_person_image", maxCount: 1 },
    { name: "winner_image", maxCount: 1 },
    { name: "event_images", maxCount: 10 },
    
    // String Fields (Existing URLs) - Multer needs to know these are okay!
    { name: "brochure_url" }, 
    { name: "existing_resource_person_image" },
    { name: "existing_winner_image" },
    { name: "existing_event_images" }
  ]),
  updateActivity
);

export default router;