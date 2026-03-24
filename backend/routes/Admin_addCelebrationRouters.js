import express from "express";
import upload from "../middleware/upload.js";
import { addCelebration } from "../controllers/Admin_addCelebrationController.js";

const router = express.Router();

router.post(
    "/add-celebration",
    upload.single("file"), // important
    addCelebration
);

export default router;