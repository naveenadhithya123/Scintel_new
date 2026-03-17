import express from "express";
import { getAllAssociationBatches } from "../controllers/associationAllBatchController.js";

const router = express.Router();

router.get("/association-batches", getAllAssociationBatches);

export default router;