const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const { discoverOfflineNetHost } = require("./discovery");
const { startBackend, stopBackend } = require("./backend");

let backendStarted = false;

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    title: "OfflineNet",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, "dist", "index.html"));
  } else {
    win.loadURL("http://localhost:5173");
  }
}

ipcMain.handle("discover-host", async () => {
  try {
    const host = await discoverOfflineNetHost();

    console.log("✅ OfflineNet host discovered:", host);

    return {
      ...host,
      isLocalHost: false,
    };
  } catch (error) {
    console.log("ℹ️ No existing OfflineNet host found.");
    console.log("🚀 This laptop will become the OfflineNet host.");

    if (!backendStarted) {
      startBackend();
      backendStarted = true;
    }

    return {
      host: null,
      port: null,
      address: null,
      isLocalHost: true,
    };
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  stopBackend();

  if (process.platform !== "darwin") {
    app.quit();
  }
});