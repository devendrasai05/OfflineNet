import express from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

import {
  uploadDocument,
  getDocuments,
} from "../controllers/sharedDocument.controller.js";

const router = express.Router();

// Get all shared documents
router.get("/", authenticate, getDocuments);

// Upload a new shared document
router.post(
  "/upload",
  authenticate,
  upload.single("file"),
  uploadDocument
);

export default router;