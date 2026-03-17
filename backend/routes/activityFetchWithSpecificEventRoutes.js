import express from "express";
import { getActivityById } from "../controllers/activityFetchWithSpecificEventController.js";

const router = express.Router();

router.get("/activities/event/:id", getActivityById);

export default router;