import express from "express";
import { deleteAnnouncement } from "../controllers/Admin_DeleteSpecificEventController.js";

const router = express.Router();

router.delete("/admin/announcement/:id/:type", deleteAnnouncement);

export default router;