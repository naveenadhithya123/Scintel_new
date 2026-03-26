import express from "express";
import { resolveSuggestion } from "../controllers/Admin_ResolveSuggestionController.js";

const router = express.Router();

router.post("/admin/suggestions/:id/resolve", resolveSuggestion);

export default router;
