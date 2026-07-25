import express from "express";
import {
  getMessages,
  getSidebar,
  updateMessage,
  removeMessage,
} from "../controllers/message.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Chat sidebar
router.get("/sidebar", authenticate, getSidebar);

// Conversation with a specific user
router.get("/:userId", authenticate, getMessages);

// Edit a message
router.put("/:id", authenticate, updateMessage);

// Delete a message
router.delete("/:id", authenticate, removeMessage);

export default router;