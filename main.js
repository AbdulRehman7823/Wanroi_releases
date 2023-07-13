const { app, BrowserView, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater, AppUpdater } = require('electron-updater');
const path = require('path')



autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;


const viewArray = [];
let win = undefined;


function createWindow(){
  win = new BrowserWindow(
    {
      width: 800,
      height: 600,
      frame: false,
      icon: path.join(__dirname, "/icon.ico"),
      center: true,
      minHeight: 600,
      minWidth: 370,
      webPreferences:{
        spellcheck:true,

        contextIsolation:false,
        nodeIntegration:true,
        nodeIntegrationInSubFrames:true,
      }
    }
   )
  win.loadURL(path.join(__dirname, 'index.html'));
  
  const view = new BrowserView()
  win.setBrowserView(view)
  view.setBounds({ x: 0, y: 40, width: win.getSize()[0]-15, height: win.getSize()[1] });
  view.setAutoResize({width:true, height:true,horizontal:true,vertical:true});
  view.webContents.loadURL("https://search.wanroi.com/");
  view.webContents.openDevTools();
  
  viewArray.push(view);

  const view2 = new BrowserView()
  view2.setBounds({ x: 0, y: 40, width: win.getSize()[0]-15, height: win.getSize()[1] });
  view2.setAutoResize({width:true, height:true,horizontal:true,vertical:true});
  view2.webContents.loadURL("https://www.wanroi.com/");
  viewArray.push(view2)
  win.maximize();
}
app.whenReady().then(() => {
   createWindow();
   app.on('activate',()=>{
    if(BrowserWindow.getAllWindows().length==0) createWindow();

   });

   autoUpdater.checkForUpdates();
})




/*New Update Available*/
autoUpdater.on("update-available", (info) => {

  win.webContents.send('show-message',`Update available. Current version ${app.getVersion()}`)
  let pth = autoUpdater.downloadUpdate();
  win.webContents.send('show-message',pth);
});

autoUpdater.on("update-not-available", (info) => {
  win.webContents.send('show-message',`No update available. Current version ${app.getVersion()}`);
});

/*Download Completion Message*/
autoUpdater.on("update-downloaded", (info) => {
  win.webContents.send('show-message',`Update downloaded. Current version ${app.getVersion()}`);
});

autoUpdater.on("error", (info) => {
  win.webContents.send('show-message',info);
});


ipcMain.on('toggle-view',(e,arg)=>{
  if(arg=="a"){
    viewArray[0].setBounds({ x: 0, y: 40, width: win.getSize()[0]-15, height: win.getSize()[1] });

      win.setBrowserView(viewArray[0]);
      viewArray[0].webContents.openDevTools();


  }else{
    viewArray[1].setBounds({ x: 0, y: 40, width: win.getSize()[0]-15, height: win.getSize()[1] });

    win.setBrowserView(viewArray[1]);
    viewArray[1].webContents.openDevTools();

  }
})

ipcMain.on('close-window', function(event){
  win.close();
})