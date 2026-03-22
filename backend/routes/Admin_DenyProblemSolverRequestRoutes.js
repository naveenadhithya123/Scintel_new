import express from "express";
import { denyProblemSolverRequest } from "../controllers/Admin_DenyProblemSolverRequestController.js";

const router = express.Router();

router.delete(
  "/admin/problem-solver-requests/deny/:id",
  denyProblemSolverRequest
);

export default router;