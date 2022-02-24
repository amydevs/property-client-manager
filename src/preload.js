const {
    contextBridge,
    ipcRenderer,
    shell
} = require("electron");
const path = require("path");

// Expose protected methods that allow the UI process to access backend functions

contextBridge.exposeInMainWorld("electron", {
    clients: {
        get: () => ipcRenderer.sendSync("clients-get"),
        write: (e) => {
            ipcRenderer.invoke("clients-write", e);
        }
      },
    window: {
        handle: (handleType) => {
            return ipcRenderer.send("window-handle", handleType);
        }
    },
    app: {
        getDocumentsPath: () => {
            return ipcRenderer.sendSync("app-getPath", "documents")
        }
    },
    shell: {
        openExternal: (url) => {
            shell.openExternal(url);
        },
        openPath: (url) => {
            shell.openPath(path.resolve(url));
        }
    },
    ipc: {
        invoke: (channel, data) => {
            return ipcRenderer.invoke(channel, data);
        },
        send: (channel, data) => {
            return ipcRenderer.send(channel, data);
        },
        receive: (channel, func) => {
            // Deliberately strip event as it includes `sender` 
            const subscription = (event, ...args) => func(...args);
            ipcRenderer.on(channel, subscription);
            return () => {
                ipcRenderer.removeListener(channel, subscription);
            }
        },
        removeAll: (channel) => {
            ipcRenderer.removeAllListeners(channel);
        }
    },
    dialog: {
        openDialog: () => {
            return ipcRenderer.sendSync('dialog-open') // adjust naming for your project
        },
    },
    fs: {
        existsSync: require('fs').existsSync
    },
    axios: {
        async get(url) {
            return (await ipcRenderer.invoke("request-get", url))
        }
    },
    store: {
        get(val) {
          return ipcRenderer.sendSync("electron-store-get", val);
        },
        set(property, val) {
          ipcRenderer.send("electron-store-set", property, val);
        },
        // Other method you want to add like has(), reset(), etc.
    },
});
console.log("preload.js");