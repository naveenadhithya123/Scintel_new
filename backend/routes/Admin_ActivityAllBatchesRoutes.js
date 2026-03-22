import express from "express";
import { getAllActivityBatches } from "../controllers/Admin_ActivityAllBatchesController.js";

const router = express.Router();

router.get("/admin/activities/batches", getAllActivityBatches);

export default router;