import express from "express";
import { fetchSpecificSuggestion } from "../controllers/Admin_FetchSpecificIdSuggestionsController.js";

const router = express.Router();

router.get("/admin/suggestions/:id", fetchSpecificSuggestion);

export default router;