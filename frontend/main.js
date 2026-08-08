const { app, BrowserWindow, ipcMain } = require("electron");

const { discoverOfflineNetHost } = require("./discovery");

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    title: "OfflineNet",
    webPreferences: {
      preload: require("path").join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL("http://localhost:5173");
}

ipcMain.handle("discover-host", async () => {
  try {
    const host = await discoverOfflineNetHost();

    console.log("✅ OfflineNet host discovered:", host);

    return host;
  } catch (error) {
    console.error("❌ OfflineNet host discovery failed:", error);

    throw error;
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
  if (process.platform !== "darwin") {
    app.quit();
  }
});