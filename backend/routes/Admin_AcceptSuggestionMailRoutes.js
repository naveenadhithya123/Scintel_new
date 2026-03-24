import express from "express";
import { sendAcceptanceMail } from "../controllers/Admin_AcceptSuggestionMailController.js";

const router = express.Router();

router.post("/admin/suggestions/accept-mail", sendAcceptanceMail);

export default router;