const { app } = require("electron");

const { healthCheck } = require("../backend/db/healthCheck.js");
const WindowManager = require("../electron/window/WindowManager.class.js");
const CreateWindow = require("../electron/window/CreateWindow.class.js");
const registerIpc = require("./ipc/index");

let win;
const windowManager = new WindowManager();
const windowFactories = {
  login: ()=> CreateWindow.create(640, 480, "Página de Login", "login.html"),
  dashboard: ()=>  CreateWindow.create(640, 480, "Página de Login", "dashboard.html")
}

async function handleOnWindow() {
  const conn = await healthCheck();
  if (conn.statusCode !== "200") {
    console.error("Database connection failed:", conn.error);
    app.quit();
    return;
  }
  win = windowFactories.login
  registerIpc({windowKey: "login", win, windowManager});
  windowManager.create("login", win)
  handleAppEvents();
}

function handleAppEvents() {
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
}

app.whenReady().then(handleOnWindow);
