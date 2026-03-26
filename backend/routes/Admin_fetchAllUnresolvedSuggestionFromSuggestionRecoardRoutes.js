import express from "express";
import { fetchAllUnresolvedSuggestionFromSuggestionRecoard } from "../controllers/Admin_fetchAllUnresolvedSuggestionFromSuggestionRecoardController.js";

const router = express.Router();

router.get(
  "/admin/suggestion-records/unresolved",
  fetchAllUnresolvedSuggestionFromSuggestionRecoard
);

export default router;
