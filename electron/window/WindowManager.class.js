const { EventEmitter } = require("node:events");

module.exports = class WindowManager extends EventEmitter {
  constructor() {
    super();
    this.windows = new Map();
  }

  create(key, factory) {    
    if (this.windows.has(key)) {
      const win = this.windows.get(key);
      if (!win.isDestroyed()) {
        win.focus();
        this.emit("window:focused", key);
        return win;
      }
    }
    console.log("Creating window with key:", key);
    console.log(win);
    

    const win = factory();
    this.windows.set(key, win);

    this.emit("window:created", key, win);

    win.on("focus", () => {
      this.emit("window:focused", key);
    });

    newWindow.in('blur', ()=>{
        this.emit("window:blurred", key);
    })

    win.on("closed", () => {
      this.windows.delete(key);
      this.emit("window:closed", key);
    });
     return win;
  }

  get(key){
    return this.windows.get(key);
  }

  close(key){
    const win = this.windows.get(key);
    if(win && !win.isDestroyed()){
        win.close();
        return true;
    }
    return false;
  }

  broadcast(channel, payload) {
    for (const win of this.windows.values()) {
      if (!win.isDestroyed()) {
        win.webContents.send(channel, payload);
      }
    }
  }
}
