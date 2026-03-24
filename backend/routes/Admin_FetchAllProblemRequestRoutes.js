import express from "express";
import { fetchAllProblemRequests } from "../controllers/Admin_FetchAllProblemRequestController.js";

const router = express.Router();

router.get(
  "/admin/problem-requests",
  fetchAllProblemRequests
);

export default router;