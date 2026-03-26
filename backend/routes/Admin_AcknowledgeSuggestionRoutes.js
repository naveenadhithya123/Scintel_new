import express from "express";
import { acknowledgeSuggestion } from "../controllers/Admin_AcknowledgeSuggestionController.js";

const router = express.Router();

router.patch("/admin/suggestions/:id/acknowledge", acknowledgeSuggestion);

export default router;
