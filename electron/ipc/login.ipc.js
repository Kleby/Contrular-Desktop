const { ipcMain } = require("electron");
const LoginService = require("../../backend/services/login.service.js");
module.exports = async function registerLoginIpc(windowManager) {
  const CreateWindow = require("../window/CreateWindow.class.js");
  ipcMain.handle("login:submit", async (event, credentials) => {
    try {
        const loginService = new LoginService();      
        console.log(credentials);
        const res = await loginService.login(credentials).then(res => res);
        return res;
    } catch (error) {
      console.error("❌ Erro ao tentar fazer login:", error);
      throw error;
    }
  });

  ipcMain.handle("login:linkRegister", async () => {
    windowManager.close("login");
    windowManager.create("register", () => {
      return CreateWindow.create(
        800,
        600,
        "Cadastro de Uusário",
        "register.html",
      );
    });
  });
};
