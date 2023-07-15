const { ipcRenderer } = require("electron");


const ipc_maximizeWindow = ()=>{
    ipcRenderer.send('maximize-window');
}

const ipc_minimizeWindow = ()=>{
    ipcRenderer.send('minimize-window');
}

const ipc_closeWindow = ()=>{
    ipcRenderer.send('close-window');
}

const ipc_unmaximizeWindow = ()=>{
    ipcRenderer.send('unmaximize-window');
}

const ipc_addTab = (obj)=>{
   ipcRenderer.send('add-tab',obj);
}

const ipc_removeTab = (obj)=>{
    ipcRenderer.send('remove-tab',obj);
}

const ipc_switchTab = (obj)=>{
    ipcRenderer.send('switch-tab',obj);
}