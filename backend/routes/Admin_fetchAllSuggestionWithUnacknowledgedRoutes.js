import express from "express";
import { fetchAllSuggestionWithUnacknowledged } from "../controllers/Admin_fetchAllSuggestionWithUnacknowledgedController.js";

const router = express.Router();

router.get(
  "/admin/suggestions/unacknowledged",
  fetchAllSuggestionWithUnacknowledged
);

export default router;
