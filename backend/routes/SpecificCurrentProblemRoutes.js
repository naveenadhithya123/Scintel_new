import express from "express";
import { getSpecificCurrentProblem } from "../controllers/SpecificCurrentProblemController.js";

const router = express.Router();

router.get("/current-problem/:id", getSpecificCurrentProblem);

export default router;