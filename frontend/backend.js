const path = require("path");
const { app, utilityProcess } = require("electron");

let backendProcess = null;

function getBackendPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "backend");
  }

  return path.join(__dirname, "..", "backend");
}

function startBackend() {
  if (backendProcess) {
    console.log("ℹ️ OfflineNet backend is already running.");
    return backendProcess;
  }

  const backendDirectory = getBackendPath();
  const backendEntry = path.join(backendDirectory, "src", "server.js");

  console.log("🚀 Starting OfflineNet backend...");
  console.log("📁 Backend directory:", backendDirectory);
  console.log("📄 Backend entry:", backendEntry);

  backendProcess = utilityProcess.fork(backendEntry, [], {
    cwd: backendDirectory,
    stdio: "pipe",
  });

  backendProcess.stdout?.on("data", (data) => {
    console.log(`[Backend] ${data.toString().trim()}`);
  });

  backendProcess.stderr?.on("data", (data) => {
    console.error(`[Backend] ${data.toString().trim()}`);
  });

  backendProcess.on("exit", (code) => {
    console.log(`🛑 OfflineNet backend exited with code ${code}.`);
    backendProcess = null;
  });

  backendProcess.on("error", (error) => {
    console.error("❌ Failed to start OfflineNet backend:", error);
    backendProcess = null;
  });

  return backendProcess;
}

function stopBackend() {
  if (!backendProcess) {
    return;
  }

  console.log("🛑 Stopping OfflineNet backend...");

  backendProcess.kill();
  backendProcess = null;
}

module.exports = {
  startBackend,
  stopBackend,
};