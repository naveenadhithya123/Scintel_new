import express from "express";
import { getActivitiesByBatch } from "../controllers/Admin_ActivitySpecificBatchAllEventController.js";

const router = express.Router();

router.get("/admin/activities/:batch", getActivitiesByBatch);

export default router;