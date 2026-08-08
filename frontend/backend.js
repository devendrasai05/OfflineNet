const path = require("path");
const { app, utilityProcess } = require("electron");

let backendProcess = null;
let backendStartPromise = null;

function getBackendPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "backend");
  }

  return path.join(__dirname, "..", "backend");
}

function startBackend() {
  if (backendProcess) {
    console.log("ℹ️ OfflineNet backend is already running.");
    return Promise.resolve(backendProcess);
  }

  if (backendStartPromise) {
    return backendStartPromise;
  }

  backendStartPromise = new Promise((resolve, reject) => {
    const backendDirectory = getBackendPath();

    const backendEntry = path.join(
      backendDirectory,
      "src",
      "server.js"
    );

    console.log("🚀 Starting OfflineNet backend...");
    console.log("📁 Backend directory:", backendDirectory);
    console.log("📄 Backend entry:", backendEntry);

    let settled = false;

    backendProcess = utilityProcess.fork(
      backendEntry,
      [],
      {
        cwd: backendDirectory,
        stdio: "pipe",
        env: {
          ...process.env,
          NODE_PATH: path.join(
            backendDirectory,
            "node_modules"
          ),
        },
      }
    );

    backendProcess.stdout?.on("data", (data) => {
      const output = data.toString().trim();

      if (!output) {
        return;
      }

      console.log(`[Backend] ${output}`);

      if (
        !settled &&
        output.includes("Server running")
      ) {
        settled = true;
        resolve(backendProcess);
      }
    });

    backendProcess.stderr?.on("data", (data) => {
      const output = data.toString().trim();

      if (!output) {
        return;
      }

      console.error(`[Backend] ${output}`);
    });

    backendProcess.on("exit", (code) => {
      console.log(
        `🛑 OfflineNet backend exited with code ${code}.`
      );

      backendProcess = null;
      backendStartPromise = null;

      if (!settled) {
        settled = true;

        reject(
          new Error(
            `OfflineNet backend exited before becoming ready. Exit code: ${code}`
          )
        );
      }
    });

    backendProcess.on("error", (error) => {
      console.error(
        "❌ Failed to start OfflineNet backend:",
        error
      );

      backendProcess = null;
      backendStartPromise = null;

      if (!settled) {
        settled = true;
        reject(error);
      }
    });
  });

  return backendStartPromise;
}

function stopBackend() {
  if (!backendProcess) {
    return;
  }

  console.log("🛑 Stopping OfflineNet backend...");

  backendProcess.kill();

  backendProcess = null;
  backendStartPromise = null;
}

module.exports = {
  startBackend,
  stopBackend,
};