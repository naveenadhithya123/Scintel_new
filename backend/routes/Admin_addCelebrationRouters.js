import express from "express";
import upload from "../middleware/upload.js";
import { addCelebration } from "../controllers/Admin_addCelebrationController.js";
import verifyAdminToken from "../middleware/verifyAdminToken.js";

const router = express.Router();

router.post(
    "/admin/add-celebration",
    verifyAdminToken,
    upload.single("file"), // important
    addCelebration
);

export default router;
