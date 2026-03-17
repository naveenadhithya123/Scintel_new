import express from "express";
import { createProblemRequest } from "../controllers/ProblemCreationRequestController.js";

const router = express.Router();

router.post("/problem-creation-request", createProblemRequest);

export default router;