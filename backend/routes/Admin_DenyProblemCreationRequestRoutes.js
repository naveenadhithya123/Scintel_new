import express from "express";
import { denyProblemCreationRequest } from "../controllers/Admin_DenyProblemCreationRequestController.js";

const router = express.Router();

router.delete(
  "/admin/problem-requests/:id",
  denyProblemCreationRequest
);

export default router;