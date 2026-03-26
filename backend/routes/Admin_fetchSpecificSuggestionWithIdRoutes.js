import express from "express";
import { fetchSpecificSuggestionWithId } from "../controllers/Admin_fetchSpecificSuggestionWithIdController.js";

const router = express.Router();

router.get("/admin/suggestions/:id", fetchSpecificSuggestionWithId);

export default router;
