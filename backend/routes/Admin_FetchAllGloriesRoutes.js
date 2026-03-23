import express from "express";
import { fetchAllGlories } from "../controllers/Admin_FetchAllGloriesController.js";

const router = express.Router();

router.get("/admin/glories", fetchAllGlories);

export default router;