import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";
import { socket } from "./lib/socket";
import { useAuth } from "./context/AuthContext";

function App() {
  const { setOnlineUsers } = useAuth();

  useEffect(() => {
    const handleConnect = () => {
      console.log("✅ Connected:", socket.id);
    };

    const handleDisconnect = () => {
      console.log("❌ Disconnected");
      setOnlineUsers([]);
    };

    const handleOnlineUsers = (users) => {
      console.log("🟢 App received online users:", users);
      setOnlineUsers(users);
    };

    const handleReceiveMessage = (message) => {
      console.log("📩 Message Received:", message);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("online-users", handleOnlineUsers);
    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("online-users", handleOnlineUsers);
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [setOnlineUsers]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;