import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Authentication routes working",
  });
});

router.post("/register", register);
router.post("/login", login);

export default router;