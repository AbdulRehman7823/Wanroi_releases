
console.time("start-timer")
const { app, BrowserView, BrowserWindow, screen } = require('electron');

const viewArray = [];
let win = undefined;


function createWindow(){

  
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow(
    {
      width: width,
      height: height,
      frame: false,
      show:false,
      icon: require('path').join(__dirname, "/icon.ico"),
      center: true,
      minHeight: 600,
      minWidth: 370,
      webPreferences:{
        javascript:true,
        nodeIntegration:true,
        nodeIntegrationInSubFrames:true,
        enableRemoteModule: true,
        contextIsolation:false,

      }
    }
   )
  win.loadFile('src/renderer/home/index.html');
  const view = new BrowserView()
  view.setBounds({ x: 0, y: 50, width: width-300, height: height });
  view.setAutoResize({width:true, height:true});
  view.webContents.loadURL("https://search.wanroi.com/");
  win.setBrowserView(view);
  win.webContents.openDevTools();
  win.once('ready-to-show',()=>{
    console.log('ssss')
    win.show();
    console.timeEnd("start-timer");
    const setupBrowserIPC = require('./ipcHandler/browser');
    const setupBrowserViewIPC = require('./ipcHandler/browserView');

    setupBrowserIPC();
    setupBrowserViewIPC(view,win.getSize());

  })
  /*
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


  setTimeout(()=>{

   const  tempwindow = new BrowserWindow(
      {
        width: 800,
        height: 600,
        frame: false,
        icon: require('path').join(__dirname, "/icon.ico"),
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
     tempwindow.loadFile('src/renderer/home/index.html');

     tempwindow.setBrowserView(viewArray[0]);
  },30000)*/

}
app.whenReady().then(() => {
   createWindow();
   app.on('activate',()=>{
    if(BrowserWindow.getAllWindows().length==0) createWindow();

   });

})


