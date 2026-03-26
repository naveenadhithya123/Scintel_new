import express from "express";
import { fetchAllresolvedSuggestionFromSuggestionRecoard } from "../controllers/Admin_fetchAllresolvedSuggestionFromSuggestionRecoardController.js";

const router = express.Router();

router.get(
  "/admin/suggestion-records/resolved",
  fetchAllresolvedSuggestionFromSuggestionRecoard
);

export default router;
