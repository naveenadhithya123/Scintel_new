import express from "express";
import { fetchAllProblemTitles } from "../controllers/Admin_CurrentProblemTitleListingController.js";

const router = express.Router();

router.get(
  "/admin/current-problems",
  fetchAllProblemTitles
);

export default router;