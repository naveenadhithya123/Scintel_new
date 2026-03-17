import express from "express";
import { getActivitiesByBatch } from "../controllers/activityFetchWithBatchController.js";

const router = express.Router();

router.get("/activities", getActivitiesByBatch);

export default router;