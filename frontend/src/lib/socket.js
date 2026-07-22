import { io } from "socket.io-client";

const token = localStorage.getItem("token");

export const socket = io("http://localhost:5000", {
  autoConnect: true,
  transports: ["websocket"],
  auth: {
    token,
  },
});