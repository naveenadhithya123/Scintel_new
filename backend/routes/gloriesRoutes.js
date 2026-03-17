import express from "express";
import { getAllGlories } from "../controllers/gloriesController.js";

const router = express.Router();

router.get("/glories", getAllGlories);

export default router;  