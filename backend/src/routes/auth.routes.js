import { Router } from "express";
import { register } from "../controllers/auth.controller.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Authentication routes working",
  });
});

router.post("/register", register);

export default router;