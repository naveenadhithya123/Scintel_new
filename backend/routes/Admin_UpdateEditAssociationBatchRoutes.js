import express from "express";
import upload from "../middleware/upload.js";
import { updateAssociationBatch } from "../controllers/Admin_UpdateEditAssociationBatchController.js";

const router = express.Router();

router.put(
  "/admin/association-batch/:id",
  upload.single("image"),
  updateAssociationBatch
);

export default router;