import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Authentication routes working",
  });
});

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authenticate, (req, res) => {
  res.json({
    success: true,
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

export default router;