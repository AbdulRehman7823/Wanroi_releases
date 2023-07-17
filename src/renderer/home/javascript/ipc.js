const { ipcRenderer } = require("electron");

const ipc_maximizeWindow = () => {
  ipcRenderer.send("maximize-window");
};

const ipc_minimizeWindow = () => {
  ipcRenderer.send("minimize-window");
};

const ipc_closeWindow = () => {
  ipcRenderer.send("close-window");
};

const ipc_unmaximizeWindow = () => {
  ipcRenderer.send("unmaximize-window");
};

const ipc_addTab = (obj) => {
  ipcRenderer.send("add-tab", obj);
};

const ipc_removeTab = (obj) => {
  ipcRenderer.send("remove-tab", obj);
};

const ipc_switchTab = (obj) => {
  ipcRenderer.send("switch-tab", obj);
};


const ipc_separateTab = (obj) => {
    ipcRenderer.send("separate-tab",obj)
}

const increaseTheLength = (obj)=>{
  ipcRenderer.send("increase-the-length",obj)
}

ipcRenderer.on("initialization",(event,args) => {
  WINDOW_ID = args.windowId;
  if(args.props){
    wanroiTabs.addTab({
      title: args.props.title,
      favicon: args.props.favicon,
      emit:"none"
    });
  }else{
  wanroiTabs.addTab({
    title: "New Tab",
    favicon: "../../../assets/logo.png",
  });
 }
});

ipcRenderer.on("did-start-loading", (e, args) => {
  const el = document.getElementById(args.id);
  if (el) {
    el.querySelector(".wanroi-tab-favicon").classList.add("loader");
  }
});

ipcRenderer.on("page-favicon-updated", (e, args) => {
  const el = document.getElementById(args.id);
  if (el) {
    const url =   args.fav ? args.fav[0] : "../../../assets/logo.png"
    const faviconEl =  el.querySelector(".wanroi-tab-favicon");
    faviconEl.style.backgroundImage = `url('${url}')`;
  }
});

ipcRenderer.on("page-title-updated", (e, args) => {
  const el = document.getElementById(args.id);
  if (el) {
    console.log(args.title)
    el.querySelector(".wanroi-tab-title").innerHTML = args.title;
  }
});


ipcRenderer.on('did-finish-load',(e,args)=>{
    const el = document.getElementById(args.id);
    if (el) {
      el.querySelector(".wanroi-tab-favicon").classList.remove("loader");
    }
})