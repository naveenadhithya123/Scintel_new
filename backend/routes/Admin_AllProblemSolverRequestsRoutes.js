import express from "express";
import { fetchAllProblemSolverRequests } from "../controllers/Admin_AllProblemSolverRequestsController.js";

const router = express.Router();

router.get(
  "/admin/problem-solver-requests",
  fetchAllProblemSolverRequests
);

export default router;