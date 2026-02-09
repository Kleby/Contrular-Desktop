const { app } = require("electron");
const path = require("node:path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { healthCheck } = require("../backend/db/healthCheck.js");
const { createWindow } = require("./window/createWindow");
const { eWindowConfigs } = require("./configs/window.config.js");

const regiterIpc = require("./ipc/index");

let mainWindow;
const menuEnabled = null;

async function handleOnWindow() {
  const conn = await healthCheck();
  if (conn.statusCode !== "200") {
    console.error("Database connection failed:", conn.error);
    app.quit();
    return;
  }

  mainWindow = createWindow();
  eWindowConfigs(mainWindow, { menuEnabled });
  regiterIpc(mainWindow);
  handleAppEvents();
}

function handleAppEvents() {
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
  app.on("activate", () => {
    if (mainWindow === null) mainWindow = createWindow();
  });
}

app.whenReady().then(handleOnWindow);
