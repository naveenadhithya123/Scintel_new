import express from "express";
import { deleteSpecificActivity } from "../controllers/Admin_DeleteSpecificActivityController.js";

const router = express.Router();

router.delete(
  "/admin/activities/:id",
  deleteSpecificActivity
);

export default router;