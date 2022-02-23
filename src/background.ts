'use strict'

import { app, protocol, BrowserWindow, ipcMain, dialog, shell, Notification } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

import path from 'path'

let win: BrowserWindow;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    width: 800,
    height: 600,
    minWidth: 370,
    minHeight: 370,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env
          .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, "preload.js")
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.webContents.on('will-navigate', (e, url) => {
    if(url != win.webContents.getURL()) {
      e.preventDefault()
      shell.openExternal(url);
    }
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e: any) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  await init()
  protocol.registerFileProtocol('filer', (request, callback) => {
    const urlParsed = new URL(request.url);
    var url = request.url.replace('filer://', '') as string;
    url = url.substring(0, url.length - urlParsed.search.length)
    try {
      if (db) {
        const rel = path.relative(db.clientsPath, url);
        if (!rel.startsWith('../') && rel !== '..') {
          return callback(path.resolve(url))
        }
      }
      throw new Error("Path santization blocked")
    }
    catch (error) {
      if (urlParsed.searchParams.get("noerror") !== "1")
      return callback("404")
    }
  })
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

// End of Boiler Plate Code
import fs from "fs";
import axios from "axios"
import Store from "electron-store";
import chokidar from "chokidar";
import schedule from "node-schedule";

import { Client, ClientsDB } from "@/modules/ClientsDB";
import { RawLocation } from 'vue-router'

const store = new Store({ watch: true });

let db: ClientsDB | undefined;
let dbWatcher: chokidar.FSWatcher | undefined;

//** Init Custom Logic */
async function init() {
  console.log("initted")
  if (dbWatcher) {
    // If database file is currently being watched, stop watching it for changes.
    await dbWatcher.close();
  }

  //Get clients path and database path from settings file.
  try {
    const clientsPath = store.get("clientsPath") as string;
    const dbPath = path.join(clientsPath, "db.json");

    // read database and iterate over it
    db = new ClientsDB(dbPath);
    iterateOverDb(db);

    // on database file change, read database and iterate over it again.
    dbWatcher = chokidar.watch(dbPath).on("all", (event, path) => {
      console.log(event)
      db = new ClientsDB(dbPath);
      iterateOverDb(db);

      // Send updated database to UI
      win.webContents.send("clients-changed", db);
    })
  }
  catch(e) {
   console.log("couldn't grab clients database") 
  }
}

// iterable notification buffer variable to avoid garbage collection during iteration over database
let notif;
//** Iterate over database, assigning notifications and creating related folders. */ 
function iterateOverDb(db:ClientsDB) {
  // Cancel all scheduled reminders if there are any
  for (const [name, job] of Object.entries(schedule.scheduledJobs)) {
    job.cancel();
  }

  // For each client in the database, create folder for client, then assign all reminder notifications
  for (const client of db.clients) {

    // Create client folder
    const dir = path.join(db.clientsPath, client.id)
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    
    // Schedule reminder notifications for each client
    for (const reminder of client.reminders) {
      schedule.scheduleJob(new Date(reminder.date), ()=> {
        console.log(`Shown reminder for ${client.fname} ${client.lname}`)
        notif = new Notification({title: reminder.title, body: reminder.details});
        notif.on("click", (e) => {
          // On clicking the notification, the UI is told to navigate to the page associated with the reminder's client
          win.webContents.send("router-push", { path: `/client-detail/${client.id}` } as RawLocation);
        })
        notif.show();
      })
    }
  }
}

// reinitialize application
ipcMain.handle("clients-init", async (event, arg) => {
  await init()
})

// return clients database to UI
ipcMain.on("clients-get", async (event, arg) => {
  event.returnValue = db;
})
// Write clients database to file when received message from UI
ipcMain.handle("clients-write", (e, adb:ClientsDB) => {
  (new ClientsDB(adb)).write();
})

//h Handlers for minimize, maximize, and close button.
ipcMain.on('window-handle', (event, handletype) => {
  switch (handletype) {
    case "minimize":
      win.minimize();
      break;
    case "maximize":
      !win.isMaximized() ? win.maximize() : win.unmaximize();
      break;
    case "close":
      win.close();
      break;
  }
})

// Sends an HTTP request using from the backend process to get around CORS.
ipcMain.handle('request-get', async (_, axios_request: string | any) => {
  const result = await axios(axios_request)
  return { data: result.data, status: result.status }
})

// Gets/Sets values in settings.
ipcMain.on("electron-store-get", async (event, val) => {
  event.returnValue = store.get(val);
});
ipcMain.on("electron-store-set", async (event, key, val) => {
  store.set(key, val);
});

// Locate folder dialog.
ipcMain.on('dialog-open', (event) => {
  try {
    event.returnValue = dialog.showOpenDialogSync({
      properties: ['openDirectory']
    })
  }
  catch {
    event.returnValue = null
  } 
})