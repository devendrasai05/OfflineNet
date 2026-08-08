import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import sharedDocumentRoutes from "./routes/sharedDocument.routes.js";
import forumRoutes from "./routes/forum.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Root Route
app.get("/", (req, res) => {
  res.json({
    message: "OfflineNet Backend is running 🚀",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/shared-documents", sharedDocumentRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/admin", adminRoutes);

export default app;