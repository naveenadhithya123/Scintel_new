import express from "express";
import { deleteActivitiesByBatch } from "../controllers/Admin_DeleteSpecificBatchActivityController.js";

const router = express.Router();

router.delete(
  "/admin/activities/batch/:batch",
  deleteActivitiesByBatch
);

export default router;