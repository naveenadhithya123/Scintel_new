import express from "express";
import { acceptProblemCreationRequest } from "../controllers/Admin_AcceptProblemCreationRequestController.js";

const router = express.Router();

router.post(
  "/admin/problem-requests/accept/:id",
  acceptProblemCreationRequest
);

export default router;