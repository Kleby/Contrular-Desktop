const { ipcMain} = require("electron")

module.exports = function registerDashboardIpc(win){
    ipcMain.handle("dashboard:home", async (event, data) =>{
        return data;
    })
}