import express from "express";
import { fetchSpecficSuggestionFromsuggestioRecoard } from "../controllers/Admin_fetchSpecficSuggestionFromsuggestioRecoardController.js";

const router = express.Router();

router.get(
  "/admin/suggestion-records/:id",
  fetchSpecficSuggestionFromsuggestioRecoard
);

export default router;
