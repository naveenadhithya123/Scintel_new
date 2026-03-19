import express from "express";
import { getUpcomingEvents } from "../controllers/upcomingEventController.js";

const router = express.Router();

router.get("/upcoming-events", getUpcomingEvents);

export default router;


