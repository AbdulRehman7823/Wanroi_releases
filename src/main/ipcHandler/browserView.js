const { ipcMain, BrowserWindow, BrowserView } = require("electron");
const array = [];
const map = new Map();

function setupBrowserViewIPC() {
  ipcMain.on("add-tab", (event, args) => {
    console.log("ADD", args);
    const mainWindow = BrowserWindow.fromWebContents(event.sender);
    let browserView = undefined;
    if (map.has(args.id)) {
      browserView = map.get(args.id);
      browserView.setBounds({
        x: 0,
        y: 50,
        width: mainWindow.getSize()[0],
        height: mainWindow.getSize()[1],
      });
      mainWindow.setBrowserView(browserView);
    } else {
      browserView = array.pop();
      map.set(args.id, browserView);
      mainWindow.setBrowserView(browserView);
      if (array.length == 2) {
        increaseLength();
      }
    }

    if (browserView !== undefined) {
      addListners(browserView, mainWindow, args.id);
    }
  });

  ipcMain.on("switch-tab", (event, args) => {
    const mainWindow = BrowserWindow.fromWebContents(event.sender);
    if (map.has(args.id)) {
      let browserView = map.get(args.id);
      browserView.setBounds({
        x: 0,
        y: 50,
        width: mainWindow.getSize()[0],
        height: mainWindow.getSize()[1],
      });

      mainWindow.setBrowserView(browserView);
    }
  });

  ipcMain.on("remove-tab", (event, args) => {
    console.log("delete", args);
    if (map.has(args.id)) {
      const v = map.get(args.id);
      v.webContents.destroy();

      map.delete(args.id);
      if (array.length < 10) {
        array.push(generateBrowserView());
      } 
    }
  });
  ipcMain.on("increase-the-length", (e, obj) => {
    increaseLength(obj);
  });
}

function addListners(view, mainWindow, id) {
  view.webContents.on("context-menu", (e) => {
    view.webContents.openDevTools();
  });

  view.webContents.on("did-start-loading", (e) => {
    mainWindow.webContents.send("did-start-loading", { id: id });
  });

  view.webContents.on("did-stop-loading", (e) => {
    console.log("did-stop-loading", e);
  });

  view.webContents.on("page-favicon-updated", (e, favicons) => {
    let fav = undefined;
    if (favicons && favicons.length > 0) {
      fav = favicons;
    }
    mainWindow.webContents.send("page-favicon-updated", { id: id, fav: fav });
  });
  view.webContents.on("page-title-updated", (e) => {
    mainWindow.webContents.send("page-title-updated", {
      id: id,
      title: view.webContents.getTitle(),
    });
  });
  view.webContents.on("did-finish-load", (e) => {
    mainWindow.webContents.send("did-finish-load", { id: id });
  });
}

function addAdvanceBrowserView() {
  for (var i = 0; i < 10; i++) {
    const view = generateBrowserView();
    array.push(view);
  }
}

function increaseLength() {
  console.log("Increase Length", array.length);
  for (var i = 0; i < 5; i++) {
    const view = generateBrowserView();
    array.push(view);
  }
}
function generateBrowserView() {
  const view = new BrowserView();
  view.setAutoResize({ width: true, height: true });
  view.webContents.loadFile("src/renderer/wanroi/wanroiHome.html");
  return view;
}
module.exports = [setupBrowserViewIPC, addAdvanceBrowserView];
