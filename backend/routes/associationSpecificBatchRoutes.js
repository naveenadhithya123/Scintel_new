import express from "express";
import { getAssociationBatchDetails } from "../controllers/associationSpecificBatchController.js";

const router = express.Router();

router.get("/association-batch/:year", getAssociationBatchDetails);

export default router;