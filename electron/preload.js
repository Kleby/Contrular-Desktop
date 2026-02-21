const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("app", {
    getAllSalesStores: ()=> ipcRenderer.invoke("sales-stores:all"),
    salesStoreById: (id)=> ipcRenderer.invoke("sales-store:get-by-id", id),
    
    test: (data)=> ipcRenderer.invoke("test-receive", data),

    //com stream de sales stores
    startStream: () => ipcRenderer.invoke("sales-stores:stream"),
    onChunk: (cb) => ipcRenderer.on("sales-stores:chunk", (_, chunk) => cb(chunk)),
    onStreamEnd: (cb) => ipcRenderer.on("sales-stores:end", cb),
    onStreamError: (cb) => ipcRenderer.on("sales-stores:error", (_, err) => cb(err)),

    //Levar e Receber
    listarLevarReceber: (orderBy, direction) => ipcRenderer.invoke("levar-receber:listar", orderBy, direction),
    levarReceberPorVendedor: (vendedorLogin, orderBy, direction) => ipcRenderer.invoke("levar-receber:por-vendedor", vendedorLogin, orderBy, direction),


    //com stream de levar e receber
    startLevarReceberStream: (orderBy, direction) => ipcRenderer.invoke("levar-receber:listar-stream", orderBy, direction),
    onLevarReceberChunk: (cb) => ipcRenderer.on("levar-receber:chunk", (_, chunk) => cb(chunk)),
    onLevarReceberStreamEnd: (cb) => ipcRenderer.on("levar-receber:end", cb),
    onLevarReceberStreamError: (cb) => ipcRenderer.on("levar-receber:error", (_, err) => cb(err)),

    login: (data) => ipcRenderer.invoke("login:submit", data),
    credentialsInvalid: () => ipcRenderer.invoke("login:invalid"),
    quit: () => ipcRenderer.send("app:quit"),
    linkRegister: ()=> ipcRenderer.invoke("login:linkRegister"),
    register:(data) => ipcRenderer.invoke("register:submit")
});

