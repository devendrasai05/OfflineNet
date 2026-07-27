import express from "express";

import upload from "../middleware/upload.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { uploadFile } from "../controllers/upload.controller.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  upload.single("file"),
  uploadFile
);

export default router;