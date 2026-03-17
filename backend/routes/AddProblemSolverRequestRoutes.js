import express from "express";
import { addProblemSolverRequest } from "../controllers/AddProblemSolverRequestController.js";

const router = express.Router();

router.post("/add-problem-solver-request", addProblemSolverRequest);

export default router;