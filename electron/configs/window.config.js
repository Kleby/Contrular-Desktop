const { Menu } = require("electron");

function eWindowConfigs(mainWindow, ...args) {
  args.forEach((a) => {
    if (!a.menuEnable) {
      Menu.setApplicationMenu(null);
    }
  });
  const menu = new Menu();
}

module.exports = { eWindowConfigs };
