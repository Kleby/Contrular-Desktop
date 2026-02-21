const { BrowserWindow } = require("electron");
const path = require("node:path");

module.exports  = class CreateWindow {

   static create( width= 640, height = 480, title = "Sem Título", filename = "", hideMenu = true){
        const win = new BrowserWindow ({
            width,
            height,
            title,
            webPreferences:{
                preload:  path.join(path.dirname(__dirname),"preload.js"),
                nodeIntegration: false,
                contextIsolation: true
            },
            autoHideMenuBar: hideMenu

        })
        if(!filename) return console.error("Passe o nome do arquivo html craido no views da aplicação");
        win.loadFile(path.join(path.dirname(__dirname),"..","renderer","views", filename))
            .catch(e => console.error("Nao foi possivel localizar o arquivo. Error:"+ e));
        return win;
    }
    

}
/*
/// Teste da aplicação
/// const create = new CreateWindow(640, 420, "title", "home.html");
/// app.whenReady().then(()=>create.create());
/// Rodei usando nox electron CreateWindow.class
*/


