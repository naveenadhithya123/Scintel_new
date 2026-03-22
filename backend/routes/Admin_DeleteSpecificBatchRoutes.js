import express from "express";
import { deleteSpecificBatch } from "../controllers/Admin_DeleteSpecificBatchController.js";

const router = express.Router();

router.delete("/admin/association-batch/:id", deleteSpecificBatch);

export default router;