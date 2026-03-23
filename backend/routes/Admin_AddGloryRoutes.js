import express from "express";
import upload from "../middleware/upload.js";
import { addGlory } from "../controllers/Admin_AddGloryController.js";

const router = express.Router();

router.post(
  "/admin/glories",
  upload.single("image"), // IMPORTANT
  addGlory
);

export default router;