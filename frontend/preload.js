const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("offlineNet", {
  discoverHost: () => ipcRenderer.invoke("discover-host"),
});