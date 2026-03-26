import express from "express";
import { fetchAllSuggestionWithAcknowledged } from "../controllers/Admin_fetchAllSuggestionWithAcknowledgedController.js";

const router = express.Router();

router.get(
  "/admin/suggestions/acknowledged",
  fetchAllSuggestionWithAcknowledged
);

export default router;
