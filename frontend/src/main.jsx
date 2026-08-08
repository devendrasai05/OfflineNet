import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";

import "./styles/theme.css";
import "./styles/common.css";
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/components.css";
import "./styles/pages.css";

import { setServerURL } from "./config";

async function startOfflineNet() {
  try {
    if (window.offlineNet?.discoverHost) {
      console.log("🔎 Discovering OfflineNet host...");

      const host = await window.offlineNet.discoverHost();

      if (host.isLocalHost) {
        const localServerURL = "http://localhost:5000";

        console.log(
          "🏠 This laptop is the OfflineNet host:",
          localServerURL
        );

        setServerURL(localServerURL);
      } else {
        console.log("🌐 Discovered OfflineNet host:", host.address);

        setServerURL(host.address);
      }
    } else {
      console.log(
        "ℹ️ Electron discovery unavailable. Using current browser host."
      );
    }
  } catch (error) {
    console.error("❌ OfflineNet host discovery failed:", error);
    console.log("ℹ️ Falling back to current browser host.");
  }

  const [{ default: App }, { AuthProvider }] = await Promise.all([
    import("./App"),
    import("./context/AuthContext"),
  ]);

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <AuthProvider>
        <App />

        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 2000,
          }}
        />
      </AuthProvider>
    </StrictMode>
  );
}

startOfflineNet();