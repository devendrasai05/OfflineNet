import express from "express";

import { authenticate } from "../middleware/auth.middleware.js";

import {
  addComment,
  fetchComments,
  updateComment,
  removeComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

// Get all comments for a post
router.get("/:postId", authenticate, fetchComments);

// Add a new comment
router.post("/:postId", authenticate, addComment);

// Edit a comment
router.put("/:commentId", authenticate, updateComment);

router.delete("/:commentId", authenticate, removeComment);

export default router;