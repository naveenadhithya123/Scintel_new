import express from "express";
import { fetchSpecificGlory } from "../controllers/Admin_FetchSpecificGloryController.js";

const router = express.Router();

router.get("/admin/glories/:id", fetchSpecificGlory);

export default router;