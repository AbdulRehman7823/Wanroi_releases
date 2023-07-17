//Adding Event Listners

//1. Window Controlls Events
/**************************************Window Controls ********************************************** */
document.getElementById("close-window-btn").addEventListener("click", (e) => {
  ipc_closeWindow();
});

document
  .getElementById("minimize-window-btn")
  .addEventListener("click", (e) => {
    ipc_minimizeWindow();
  });

document
  .getElementById("maxunmax-window-btn")
  .addEventListener("click", (e) => {
    const element = document.getElementById("maxunmax-window-btn");
    if (element.classList.contains("max")) {
      element.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0 0v-600 600Z"/></svg>`;
      element.classList.remove("max");
      ipc_unmaximizeWindow();
    } else {
      element.innerHTML = ` <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"
          xmlns:svgjs="http://svgjs.com/svgjs" width="10" height="10" x="0" y="0" viewBox="0 0 512 512"
          style="enable-background: new 0 0 512 512" xml:space="preserve" class="hovered-paths">
          <g>
            <path
              d="M386.612 114.939H10.449C4.679 114.939 0 119.617 0 125.388v376.163C0 507.321 4.679 512 10.449 512h376.163c5.77 0 10.449-4.679 10.449-10.449V125.388c0-5.771-4.678-10.449-10.449-10.449zm-10.449 376.163H20.898V135.837h355.265v355.265z"
               data-original="#000000" class="hovered-path"></path>
            <path
              d="M502.633 0H126.469c-5.77 0-11.531 3.978-11.531 9.747V82.89c0 5.772 4.679 10.449 10.449 10.449s10.449-4.677 10.449-10.449V20.898h355.265v355.265h-51.163c-5.77 0-10.449 4.679-10.449 10.449s4.679 10.449 10.449 10.449h62.694c5.77 0 9.367-5.379 9.367-11.151V9.747C512 3.978 508.403 0 502.633 0z"
               data-original="#000000" class="hovered-path"></path>
          </g>
        </svg>`;

      element.classList.add("max");
      ipc_maximizeWindow();
    }
  });
//****************************************End For Browser Window Controls ******************************* */
//********************************************************************************************************** */

var el = document.querySelector(".wanroi-tabs");
var wanroiTabs = new WanroiTabs();

wanroiTabs.init(el);

el.addEventListener("activeTabChange", ({ detail }) => {
  ipc_switchTab({ id: detail.tabEl.id });
});
el.addEventListener("tabAdd", ({ detail }) => {
  ipc_addTab({ id: detail.tabEl.id });
});
el.addEventListener("tabRemove", ({ detail }) => {
  ipc_removeTab({ id: detail.tabEl.id });
});

document.querySelector("#add-btn-span").addEventListener("click", (_) => {
  wanroiTabs.addTab({
    title: "New Tab",
    favicon: "../../../assets/logo.png",
  });
});

window.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key === "t") {
    wanroiTabs.addTab({
      title: "New Tab",
      favicon: "../../../assets/logo.png",
    });
  }
});
