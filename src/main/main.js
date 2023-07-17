const { app, BrowserWindow, screen, ipcMain } = require("electron");


const windows =  [];
const setupBrowserIPC = require("./ipcHandler/browser");
const [setupBrowserViewIPC,addAdvanceBrowserView] = require("./ipcHandler/browserView");
setupBrowserIPC();
setupBrowserViewIPC();
function createAdvanceWindow(){
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const win = new BrowserWindow({
    width: width,
    height: height,
    frame: false,
    show: false,
    icon: require("path").join(__dirname, "/icon.ico"),
    center: true,
    minHeight: 600,
    minWidth: 370,
    webPreferences: {
      javascript: true,
      nodeIntegration: true,
      nodeIntegrationInSubFrames: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });
  win.loadFile("src/renderer/home/index.html");
  windows.push(win);

}
function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const win = new BrowserWindow({
    width: width,
    height: height,
    frame: false,
    show: false,
    icon: require("path").join(__dirname, "/icon.ico"),
    center: true,
    minHeight: 600,
    minWidth: 370,
    webPreferences: {
      javascript: true,
      nodeIntegration: true,
      nodeIntegrationInSubFrames: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });
  win.loadFile("src/renderer/home/index.html");
  windows.push(win);
  addAdvanceBrowserView();

  win.once("ready-to-show", () => {
    win.webContents.send("initialization",{windowId:"win_0"});
    win.show();
    setTimeout(()=>createAdvanceWindow(),500)
  });
}
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length == 0) createWindow();
  });
});

ipcMain.on("separate-tab", (event, args) => {
  console.log(args)
  windows[1].show();

});
