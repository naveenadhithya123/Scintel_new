import express from "express";
import { addActivity } from "../controllers/Admin_AddActivityController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post(
    "/admin/activity",
    upload.fields([
        { name: "brochure", maxCount: 1 },
        { name: "resource_person_image", maxCount: 1 },
        { name: "winner_image", maxCount: 1 },
        { name: "event_images", maxCount: 10 }
    ]),
    addActivity
);

export default router;