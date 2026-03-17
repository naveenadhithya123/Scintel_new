import express from "express";
import { getUpcomingEventWithSpecificId } from "../controllers/upcomingEventFetchWithSpecificIdController.js";

const router = express.Router();

router.get("/upcoming-events/:id", getUpcomingEventWithSpecificId);

export default router;