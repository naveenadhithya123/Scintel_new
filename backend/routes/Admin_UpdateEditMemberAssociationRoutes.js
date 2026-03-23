import express from "express";
import { updateAssociationMember } from "../controllers/Admin_UpdateEditMemberAssociationController.js";

const router = express.Router();

router.put(
  "/admin/association-members/:register_number",
  updateAssociationMember
);

export default router;