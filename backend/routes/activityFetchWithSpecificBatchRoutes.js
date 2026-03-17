import express from "express";
import { getActivitiesBySpecificBatch } from "../controllers/activityFetchWithSpecificBatchController.js";

const router = express.Router();

router.get("/activities/batch/:batch", getActivitiesBySpecificBatch);

export default router;