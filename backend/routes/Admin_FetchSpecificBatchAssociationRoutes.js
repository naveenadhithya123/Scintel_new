import express from "express";
import { fetchSpecificBatch } from "../controllers/Admin_FetchSpecificBatchAssociationController.js";

const router = express.Router();

router.get(
  "/admin/association-batch/:id",
  fetchSpecificBatch
);

export default router;