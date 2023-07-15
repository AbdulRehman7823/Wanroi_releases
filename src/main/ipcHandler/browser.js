const { ipcMain, BrowserWindow } = require('electron');

function setupBrowserIPC() {


  ipcMain.on('close-window', (event, args) => {
    const mainWindow = BrowserWindow.fromWebContents(event.sender);
    if(mainWindow.closable)
        mainWindow.close();
  });

  ipcMain.on('maximize-window', (event, args) => {
    const mainWindow = BrowserWindow.fromWebContents(event.sender);
    if(mainWindow.maximizable)
        mainWindow.maximize();
  });

  ipcMain.on('minimize-window', (event, args) => {
    const mainWindow = BrowserWindow.fromWebContents(event.sender);
    if(mainWindow.minimizable)
      mainWindow.minimize();
  });

  ipcMain.on('unmaximize-window', (event, args) => {
    const mainWindow = BrowserWindow.fromWebContents(event.sender);
    if(mainWindow.isMaximized)
    (mainWindow.unmaximize())
  });
}

module.exports = setupBrowserIPC;
