import express from "express";
import upload from "../middleware/upload.js";
import { addEvent } from "../controllers/Admin_addEventController.js";
import verifyAdminToken from "../middleware/verifyAdminToken.js";

const router = express.Router();

router.post(
  "/admin/add-event",
  verifyAdminToken,
  upload.single("file"),
  addEvent
);

export default router;
