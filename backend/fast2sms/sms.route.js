import express from "express";
import { sendSMS, sendSchemesSMS } from "./sms.controller.js"; // Import sendSchemesSMS   

const router = express.Router();

router.post("/send", sendSMS);

// Route to send government schemes SMS
router.post("/send-schemes", sendSchemesSMS);

export default router;