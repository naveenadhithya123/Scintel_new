import express from "express";
import { fetchSpecificProblemSolverRequest } from "../controllers/Admin_FetchSpecificProblemSolverRequestController.js";

const router = express.Router();

router.get(
  "/admin/problem-solver-requests/:id",
  fetchSpecificProblemSolverRequest
);

export default router;