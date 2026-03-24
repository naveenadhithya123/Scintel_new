import express from "express";
import { fetchAllSuggestions } from "../controllers/Admin_FetchAllSuggestionsController.js";

const router = express.Router();

router.get("/admin/suggestions", fetchAllSuggestions);

export default router;