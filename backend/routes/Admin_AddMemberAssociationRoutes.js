import express from "express";
import { addAssociationMember } from "../controllers/Admin_AddMemberAssociationController.js";

const router = express.Router();

router.post("/admin/association-members", addAssociationMember);

export default router;