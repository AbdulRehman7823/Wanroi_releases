const { ipcMain, BrowserWindow ,BrowserView} = require('electron');

const map = new Map();


function setupBrowserViewIPC(firstView,s) {


    map.set("tab_0",firstView);
    for(var i = 3; i <100;i++){
        const view = generateBrowserView(s);
        map.set("tab_"+i,view);
    }
    ipcMain.on('add-tab', (event, args) => {
        const mainWindow = BrowserWindow.fromWebContents(event.sender);
        if (map.has(args.id)) {
           mainWindow.setBrowserView(map.get(args.id));
        }
      });

      ipcMain.on('switch-tab', (event, args) => {
        const mainWindow = BrowserWindow.fromWebContents(event.sender);
        if (map.has(args.id)) {
           mainWindow.setBrowserView(map.get(args.id));
        }
      });

      ipcMain.on('remove-tab', (event, args) => {
        if (map.has(args.id)) {
            map.delete(args.id);
        }
      });
}


function generateBrowserView(sizes) {
    const view = new BrowserView()
    view.setBounds({ x: 0, y: 50, width: sizes[0], height: sizes[1] });
    view.setAutoResize({width:true, height:true});
    view.webContents.loadURL("https://search.wanroi.com/");
    return view;
}
module.exports = setupBrowserViewIPC;
