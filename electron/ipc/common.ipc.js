const { ipcMain, app } = require("electron");

module.exports = function registerCommonIpc(winManager){
    ipcMain.handle("app:quit", ()=>{
        app.quit();
    }),

    ipcMain.handle("window:close", (_, key)=> winManager.close(key))
}