const { ipcMain } = require('electron');
const levarReceberService = require('../../backend/services/levarReceber.service.js');

module.exports = function registerLevarReceberIpc(mainWindow) {
    ipcMain.handle("levar-receber:listar", async (_, orderBy, direction) => {
        try {
          return await levarReceberService.listarLevarReceber(orderBy, direction);
        } catch (error) {
          console.error("❌ Erro ao carregar a lista de levar e receber:", error);
          throw error;
        }
    });

    ipcMain.handle("levar-receber:listar-stream", async (_, orderBy, direction) => {
        levarReceberService.onStreamLevarReceber({
          sendChunk: (chunk) => mainWindow.webContents.send("levar-receber:chunk", chunk),
          sendEnd: () => mainWindow.webContents.send("levar-receber:end"),
          sendError: (err) => mainWindow.webContents.send("levar-receber:error", err)
        }, orderBy, direction);
        return {started: true};
        });
    
    ipcMain.handle("levar-receber:por-vendedor", async (_, vendedorLogin, orderBy, direction) => {
        try {
          return await levarReceberService.levarReceberPorVendedor(vendedorLogin, orderBy, direction);
        } catch (error) {
          console.error(`❌ Erro ao carregar levar e receber por vendedor ${vendedorLogin}:`, error);
          throw error;
        }
    });
  }
