import express from "express";
import { acceptProblemSolverRequest } from "../controllers/Admin_AcceptProblemSolverRequestController.js";

const router = express.Router();

router.post(
  "/admin/problem-solver-requests/accept/:id",
  acceptProblemSolverRequest
);

export default router;