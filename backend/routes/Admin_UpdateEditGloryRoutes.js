import express from "express";
import upload from "../middleware/upload.js";
import { updateGlory } from "../controllers/Admin_UpdateEditGloryController.js";

const router = express.Router();

router.put(
  "/admin/glories/:id",
  upload.single("image"),
  updateGlory
);

export default router;