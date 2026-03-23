import express from "express";
import { deleteSpecificSuggestion } from "../controllers/Admin_DeleteSpecificSuggestionController.js";

const router = express.Router();

router.delete("/admin/suggestions/:id", deleteSpecificSuggestion);

export default router;