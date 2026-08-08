import dotenv from "dotenv";
import http from "http";
import { initializeSocket } from "./socket/socket.js";
import { startDiscoveryServer } from "./discovery/discovery.js";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
initializeSocket(server);

// Start HTTP server
server.listen(PORT, "0.0.0.0", () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`
  );

  // Start OfflineNet LAN discovery
  startDiscoveryServer(PORT);
});