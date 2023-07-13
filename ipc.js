const {ipcRenderer} = require('electron')



ipcRenderer.on('show-message',(event,message)=>{
    document.getElementById('message').innerText = message;
})
function openView(el){
    console.log(el)
    ipcRenderer.send('toggle-view',el);
}
function closeWindow(){
    ipcRenderer.send('close-window');
}