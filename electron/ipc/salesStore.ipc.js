const { ipcMain } = require("electron");
const salesStore = require("../../backend/services/salesStore.service.js");

module.exports = function registerSalesStoreIpc(mainWindow) {
  ipcMain.handle("sales-stores:all", async () => {
    try {
      return await salesStore.listStores();
    } catch (error) {
      console.error("❌ Failed to list stores:", error);
      throw error;
    }
  });
  ipcMain.handle("sales-stores:stream", async () => {
    salesStore.listStoresOnStream({
        sendChunk: (chunk)=> mainWindow.webContents.send("sales-stores:chunk", chunk),
        sendEnd: ()=> mainWindow.webContents.send("sales-stores:end"),
        sendError: (err)=> mainWindow.webContents.send("sales-stores:error", err)
    })
    return {started: true};
  });

  ipcMain.handle("sales-store:get-by-id", async (_, id) => {
    try {
      return await salesStore.getStoreById(id);
    } catch (error) {
      console.error(`❌ Failed to get store with ID ${id}:`, error);
      throw error;
    }
  });
};
