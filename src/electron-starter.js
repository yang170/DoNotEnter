// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const path = require("path");
const permission = require(path.join(
  app.getAppPath(),
  "./src/services/Permission.js"
));

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 390,
    height: 600,
    webPreferences: {
      preload: path.join(app.getAppPath(), "./src/services/preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL("http://localhost:3000");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  if (process.platform === "linux") {
    permission.linuxSetup();
  }
  createWindow();
  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform === "linux") {
    permission.linuxCleanup(app.quit);
  } else {
    if (process.platform !== "darwin") app.quit();
  }
});
