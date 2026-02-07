const { EventEmitter } = require("node:events");

class WindowManager extends EventEmitter {
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

    const newWindow = factory();
    this.windows.set(key, newWindow);

    this.emit("window:created", key, newWindow);

    newWindow.on("focus", () => {
      this.emit("window:focused", key);
    });

    newWindow.in('blur', ()=>{
        this.emit("window:blurred", key);
    })

    newWindow.on("closed", () => {
      this.windows.delete(key);
      this.emit("window:closed", key);
    });
     return newWindow;
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
