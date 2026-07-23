import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { socket } from "./lib/socket";

function App() {
  useEffect(() => {
    const handleConnect = () => {
      console.log("✅ Connected:", socket.id);
    };

    const handleDisconnect = () => {
      console.log("❌ Disconnected");
    };

    const handleOnlineUsers = (users) => {
      console.log("🟢 Online Users:", users);
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
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;