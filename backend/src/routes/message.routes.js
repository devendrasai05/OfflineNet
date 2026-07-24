import express from "express";
import {
  getMessages,
  getSidebar,
} from "../controllers/message.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Chat sidebar
router.get("/sidebar", authenticate, getSidebar);

// Conversation with a specific user
router.get("/:userId", authenticate, getMessages);

export default router;