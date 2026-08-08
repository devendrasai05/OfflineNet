import { io } from "socket.io-client";

import { SERVER_URL } from "../config";

export const socket = io(SERVER_URL, {
  autoConnect: false,
  transports: ["websocket"],
});

export const connectSocket = (token) => {
  console.log("connectSocket() called");
  socket.auth = { token };
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};