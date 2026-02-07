const { BrowserWindow } = require("electron");
const path = require("node:path");

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname,"../", "preload.js")
        }
    });
    win.loadFile(path.join(__dirname, "../","../interface", "index.html"));
    return win;
}

module.exports = {createWindow};