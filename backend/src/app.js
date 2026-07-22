import express from "express";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// Middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "OfflineNet Backend is running 🚀",
  });
});

app.use("/api/auth", authRoutes);

export default app;