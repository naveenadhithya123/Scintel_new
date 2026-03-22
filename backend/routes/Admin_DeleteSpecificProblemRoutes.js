import express from "express";
import { deleteSpecificProblem } from "../controllers/Admin_DeleteSpecificProblemController.js";

const router = express.Router();

router.delete(
  "/admin/current-problems/:id",
  deleteSpecificProblem
);

export default router;