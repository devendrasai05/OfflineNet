import express from "express";
import { getMessages } from "../controllers/message.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:userId", authenticate, getMessages);

export default router;