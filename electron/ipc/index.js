const registerSalesStoreIpc = require("./salesStore.ipc.js");
const registerLevarReceberIpc = require("./levarReceber.ipc.js");
module.exports = function registerIpc(mainWindow) {
    registerSalesStoreIpc(mainWindow);
    registerLevarReceberIpc(mainWindow);
}



// function registerIpc() {
//     ipcMain.handle("test-receive", async (_event, {name})=>{
//         return `Hello ${name}`;
//     });
// }

// module.exports = registerIpc ;
