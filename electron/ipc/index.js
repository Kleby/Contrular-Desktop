const registerSalesStoreIpc = require("./salesStore.ipc.js");
const registerLevarReceberIpc = require("./levarReceber.ipc.js");
const registerLoginIpc = require("./login.ipc.js");
const registerCommonIpc =require("./common.ipc.js"); 
const registerDashboardIpc = require("./dashboard.ip.js");

module.exports = function registerIpc({windowKey, win, windowManager}) {
    registerSalesStoreIpc(win);
    registerLevarReceberIpc(win);
    registerCommonIpc(windowManager);  

    switch (windowKey){
        case 'login':
            registerLoginIpc(windowManager);
            break;
        case 'dashboard':
            registerDashboardIpc(windowManager);
            break;
    }
}




// function registerIpc() {
//     ipcMain.handle("test-receive", async (_event, {name})=>{
//         return `Hello ${name}`;
//     });
// }

// module.exports = registerIpc ;
