import express from "express";
import { getActivityById } from "../controllers/Admin_editActivityController.js";

const router = express.Router();

router.get("/admin/activity/:id", getActivityById);

export default router;