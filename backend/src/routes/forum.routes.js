import express from "express";
import {
  createPost,
  getPosts,
  deletePost,
  toggleLike,
  editPost,
  addComment,
  searchPosts,
} from "../controllers/forum.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Create a new post
router.post("/", authenticate, createPost);

// Get all posts
router.get("/", authenticate, getPosts);



// Search posts
router.get("/search", authenticate, searchPosts);

// Like / Unlike a post
router.post("/:id/like", authenticate, toggleLike);

router.put("/:id", authenticate, editPost);

// Add comment to a post
router.post("/:id/comment", authenticate, addComment);

// Delete own post
router.delete("/:id", authenticate, deletePost);



export default router;