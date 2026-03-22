import express from "express";
import upload from "../middleware/upload.js"; // multer + cloudinary
import { addSuggestion } from "../controllers/suggestionPostController.js";

const router = express.Router();

router.post(
  "/add-suggestion",
  upload.single("proof"), // IMPORTANT: must match frontend field name
  addSuggestion
);

export default router;