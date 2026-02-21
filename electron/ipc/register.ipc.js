const { ipcMain } = require("electron");

module.exports = function registerUserRegisterIpc(windowManager){
    ipcMain.handle("register:submit", async(event, data) => {
        console.log(data);
    });
}