import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import {
  addUser,
  removeUser,
  getOnlineUsers,
  getUserSocket,
} from "./onlineUsers.js";

import { createMessage } from "../services/message.service.js";

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Socket Authentication
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
    console.log(`✅ ${socket.user.email} connected (${socket.id})`);

    // Add user to online users list
    addUser(socket.user.id, socket.id);

    // Broadcast online users
    io.emit("online-users", getOnlineUsers());

    // Debug: Log every incoming event
    socket.onAny((event, ...args) => {
      console.log("📡 Event:", event, args);
    });

    // Handle sending messages
    socket.on("send-message", async ({ receiverId, message }) => {
      try {
        // Save message to database
        const savedMessage = await createMessage({
          senderId: socket.user.id,
          receiverId,
          message,
        });

        console.log("💾 Message saved:", savedMessage);

        // Check if receiver is online
        const receiverSocketId = getUserSocket(receiverId);

        // Send message to receiver
        if (receiverSocketId) {
          io.to(receiverSocketId).emit(
            "receive-message",
            savedMessage
          );
        }

        // Send the message back to the sender too
socket.emit("receive-message", savedMessage);
      } catch (error) {
        console.error("❌ Error saving message:", error);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`❌ ${socket.user.email} disconnected`);

      removeUser(socket.user.id);

      io.emit("online-users", getOnlineUsers());
    });
  });

  return io;
};