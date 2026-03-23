import express from "express";
import { fetchSpecificProblem } from "../controllers/Admin_CurrentProblemSpecificProblemFetchingController.js";

const router = express.Router();

router.get(
  "/admin/current-problems/:id",
  fetchSpecificProblem
);

export default router;