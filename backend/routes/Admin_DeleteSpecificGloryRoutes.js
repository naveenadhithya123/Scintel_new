import express from "express";
import { deleteSpecificGlory } from "../controllers/Admin_DeleteSpecificGloryController.js";

const router = express.Router();

router.delete("/admin/glories/:id", deleteSpecificGlory);

export default router;