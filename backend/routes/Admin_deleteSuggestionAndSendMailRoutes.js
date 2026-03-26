import express from "express";
import { deleteSuggestionAndSendMail } from "../controllers/Admin_deleteSuggestionAndSendMailController.js";

const router = express.Router();

router.post(
  "/admin/suggestions/delete-send-mail",
  deleteSuggestionAndSendMail
);

export default router;
