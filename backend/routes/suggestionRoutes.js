import express from "express";
import { addSuggestion } from "../controllers/suggestionPostController.js";

const router = express.Router();

router.post("/add-suggestion", addSuggestion);

export default router;