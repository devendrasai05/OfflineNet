const fs = require("fs");
const path = require("path");

const frontendDir = __dirname;
const backendDir = path.resolve(frontendDir, "../backend");
const backendNodeModules = path.join(backendDir, "node_modules");

module.exports = {
  appId: "com.offlinenet.app",
  productName: "OfflineNet",

  directories: {
    output: "release",
  },

  files: [
    "dist/**/*",
    "main.js",
    "preload.js",
    "discovery.js",
    "backend.js",
  ],

  extraResources: [
    {
      from: backendDir,
      to: "backend",
      filter: [
        "**/*",
        "!node_modules/**/*",
      ],
    },
  ],

  afterPack: async (context) => {
    const packagedBackendNodeModules = path.join(
      context.appOutDir,
      "resources",
      "backend",
      "node_modules"
    );

    console.log("📦 Copying backend node_modules...");
    console.log("📁 Source:", backendNodeModules);
    console.log("📁 Destination:", packagedBackendNodeModules);

    if (!fs.existsSync(backendNodeModules)) {
      throw new Error(
        `Backend node_modules not found: ${backendNodeModules}`
      );
    }

    fs.cpSync(
      backendNodeModules,
      packagedBackendNodeModules,
      {
        recursive: true,
        force: true,
      }
    );

    console.log("✅ Backend node_modules copied.");
  },

  win: {
    target: "portable",
  },
};