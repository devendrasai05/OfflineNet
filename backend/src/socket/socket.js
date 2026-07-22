import { Server } from "socket.io";
import jwt from "jsonwebtoken";

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication token missing"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(
      `✅ ${socket.user.email} connected (${socket.id})`
    );

    socket.on("disconnect", () => {
      console.log(
        `❌ ${socket.user.email} disconnected`
      );
    });
  });

  return io;
};