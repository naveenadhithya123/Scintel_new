import express from "express";
import upload from "../middleware/upload.js";
import { addEvent } from "../controllers/Admin_addEventController.js";

const router = express.Router();

router.post(
  "/add-event",
  upload.single("file"),
  addEvent
);

export default router;