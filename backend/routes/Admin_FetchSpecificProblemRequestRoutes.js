import express from "express";
import { fetchSpecificProblemRequest } from "../controllers/Admin_FetchSpecificProblemRequestController.js";

const router = express.Router();

router.get(
  "/admin/problem-requests/:id",
  fetchSpecificProblemRequest
);

export default router;