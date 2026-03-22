import express from "express";
import upload from "../middleware/upload.js";
import { addAssociationBatch } from "../controllers/Admin_AddAssociationBatchController.js";

const router = express.Router();

router.post(
  "/admin/association-batch",
  upload.single("image"),
  addAssociationBatch
);

export default router;