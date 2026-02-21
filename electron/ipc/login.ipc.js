const { ipcMain } = require("electron");
// const loginService = require("../../backend/services/login.service.js");
const UsuarioService = require("../../backend/services/login.service.js")
module.exports = async function registerLoginIpc(windowManager) {
  const CreateWindow = require("../window/CreateWindow.class.js");
  ipcMain.handle("login:submit", async (event, credentials) => {
    // if (credentials.username.toUpperCase() === "ADMIN" && credentials.password === "1234"){
    //     windowManager.close("login");

    //     windowManager.create("dashboard", ()=>{
    //         return CreateWindow.create(800, 600, "Página de Dashebaord", "dashboard.html")
    //     })
    //     return {
    //         success: true,
    //         message: "Credentials valid",
    //         user: credentials.username
    //     }
    // }
    // return {
    //     success: false,
    //     message: "Credentiasl invalid"
    // }
    try {
        const loginService = new UsuarioService();        
        await loginService.login(credentials).then(d => console.log(d));
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
