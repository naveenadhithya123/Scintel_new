import express from "express";
import { getAllCurrentProblems } from "../controllers/currentProblemsController.js";

const router = express.Router();

router.get("/current-problems", getAllCurrentProblems);

export default router;