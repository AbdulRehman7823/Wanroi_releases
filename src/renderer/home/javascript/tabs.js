

  let WINDOW_ID = "";
  let counter =0;
  const TAB_CONTENT_MARGIN = 0;
  const TAB_CONTENT_OVERLAP_DISTANCE = 1;

  const TAB_OVERLAP_DISTANCE =
    TAB_CONTENT_MARGIN * 2 + TAB_CONTENT_OVERLAP_DISTANCE;

  const TAB_CONTENT_MIN_WIDTH = 24;
  const TAB_CONTENT_MAX_WIDTH = 240;

  const TAB_SIZE_SMALL = 84;
  const TAB_SIZE_SMALLER = 60;
  const TAB_SIZE_MINI = 48;

  let tabCounter=0;
  const noop = (_) => {};

  const closest = (value, array) => {
    let closest = Infinity;
    let closestIndex = -1;

    array.forEach((v, i) => {
      if (Math.abs(value - v) < closest) {
        closest = Math.abs(value - v);
        closestIndex = i;
      }
    });

    return closestIndex;
  };

  const tabTemplate = `
    <div class="wanroi-tab" style="-webkit-app-region: no-drag">
      <div class="wanroi-tab-dividers"></div>
      <div class="wanroi-tab-background">
      </div>
      <div class="wanroi-tab-content">
        <div class="wanroi-tab-favicon"></div>
        <div class="wanroi-tab-title"></div>
        <div class="wanroi-tab-drag-handle"></div>
        <div class="wanroi-tab-close"></div>
      </div>
    </div>
  `;

  const defaultTapProperties = {
    title: "New tab",
    favicon: false,
  };

  let instanceId = 0;

  class WanroiTabs {
    constructor() {
      this.draggabillies = [];
    }

    init(el) {
      this.el = el;

      this.instanceId = instanceId;
      this.el.setAttribute("data-wanroi-tabs-instance-id", this.instanceId);
      instanceId += 1;

      this.setupCustomProperties();
      this.setupStyleEl();
      this.setupEvents();
      this.layoutTabs();
      this.setupDraggabilly();
    }

    emit(eventName, data) {
      this.el.dispatchEvent(new CustomEvent(eventName, { detail: data }));
    }

    setupCustomProperties() {
      this.el.style.setProperty(
        "--tab-content-margin",
        `${TAB_CONTENT_MARGIN}px`
      );
    }

    setupStyleEl() {
      this.styleEl = document.createElement("style");
      this.el.appendChild(this.styleEl);
    }

    setupEvents() {
      window.addEventListener("resize", (_) => {
        this.cleanUpPreviouslyDraggedTabs();
        this.layoutTabs();
      });

      this.el.addEventListener("dblclick", (event) => {
        if ([this.el, this.tabContentEl].includes(event.target)) this.addTab();
      });

      this.tabEls.forEach((tabEl) => this.setTabCloseEventListener(tabEl));
    }

    get tabEls() {
      return Array.prototype.slice.call(
        this.el.querySelectorAll(".wanroi-tab")
      );
    }

    get tabContentEl() {
      return this.el.querySelector(".wanroi-tabs-content");
    }

    get tabContentWidths() {
      const numberOfTabs = this.tabEls.length;
      const tabsContentWidth = this.tabContentEl.clientWidth;
      const tabsCumulativeOverlappedWidth =
        (numberOfTabs - 1) * TAB_CONTENT_OVERLAP_DISTANCE;
      const targetWidth =
        (tabsContentWidth -
          2 * TAB_CONTENT_MARGIN +
          tabsCumulativeOverlappedWidth) /
        numberOfTabs;
      const clampedTargetWidth = Math.max(
        TAB_CONTENT_MIN_WIDTH,
        Math.min(TAB_CONTENT_MAX_WIDTH, targetWidth)
      );
      const flooredClampedTargetWidth = Math.floor(clampedTargetWidth);
      const totalTabsWidthUsingTarget =
        flooredClampedTargetWidth * numberOfTabs +
        2 * TAB_CONTENT_MARGIN -
        tabsCumulativeOverlappedWidth;
      const totalExtraWidthDueToFlooring =
        tabsContentWidth - totalTabsWidthUsingTarget;

      // TODO - Support tabs with different widths / e.g. "pinned" tabs
      const widths = [];
      let extraWidthRemaining = totalExtraWidthDueToFlooring;
      for (let i = 0; i < numberOfTabs; i += 1) {
        const extraWidth =
          flooredClampedTargetWidth < TAB_CONTENT_MAX_WIDTH &&
          extraWidthRemaining > 0
            ? 1
            : 0;
        widths.push(flooredClampedTargetWidth + extraWidth);
        if (extraWidthRemaining > 0) extraWidthRemaining -= 1;
      }

      return widths;
    }

    get tabContentPositions() {
      const positions = [];
      const tabContentWidths = this.tabContentWidths;

      let position = TAB_CONTENT_MARGIN;
      tabContentWidths.forEach((width, i) => {
        const offset = i * TAB_CONTENT_OVERLAP_DISTANCE;
        positions.push(position - offset);
        position += width;
      });

      return positions;
    }

    get tabPositions() {
      const positions = [];

      this.tabContentPositions.forEach((contentPosition) => {
        positions.push(contentPosition - TAB_CONTENT_MARGIN);
      });

      return positions;
    }

    layoutTabs() {
      const tabContentWidths = this.tabContentWidths;

      this.tabEls.forEach((tabEl, i) => {
        const contentWidth = tabContentWidths[i];
        const width = contentWidth + 2 * TAB_CONTENT_MARGIN;

        tabEl.style.width = width + "px";
        tabEl.removeAttribute("is-small");
        tabEl.removeAttribute("is-smaller");
        tabEl.removeAttribute("is-mini");

        if (contentWidth < TAB_SIZE_SMALL) tabEl.setAttribute("is-small", "");
        if (contentWidth < TAB_SIZE_SMALLER)
          tabEl.setAttribute("is-smaller", "");
        if (contentWidth < TAB_SIZE_MINI) tabEl.setAttribute("is-mini", "");
      });

      let styleHTML = "";
      this.tabPositions.forEach((position, i) => {
        styleHTML += `
          .wanroi-tabs[data-wanroi-tabs-instance-id="${
            this.instanceId
          }"] .wanroi-tab:nth-child(${i + 1}) {
            transform: translate3d(${position}px, 0, 0)
          }
        `;
      });
      this.styleEl.innerHTML = styleHTML;
    }

    createNewTabEl() {
      const div = document.createElement("div");
      div.innerHTML = tabTemplate;
      return div.firstElementChild;
    }

    addTab(tabProperties, { animate = true, background = false } = {}) {
      const tabEl = this.createNewTabEl();

      if (animate) {
        tabEl.classList.add("wanroi-tab-was-just-added");
        setTimeout(
          () => tabEl.classList.remove("wanroi-tab-was-just-added"),
          500
        );
      }

      tabProperties = Object.assign({}, defaultTapProperties, tabProperties);
      const addBtn = document.getElementById("add-btn");
      tabEl.id=WINDOW_ID+"_tab_"+counter;
      this.tabContentEl.insertBefore(tabEl, addBtn);
      this.setTabCloseEventListener(tabEl);
      this.updateTab(tabEl, tabProperties);
      if(tabProperties.emit && tabProperties.emit=="none"){
        console.log("ok")
      }
      else{
      this.emit("tabAdd", { tabEl });
      }
      if (!background) this.setCurrentTab(tabEl);
      this.cleanUpPreviouslyDraggedTabs();
      this.layoutTabs();
      this.setupDraggabilly();
      counter++;
      if(this.tabEls.length==2){
        tabEl.style.webkitAppRegion = 'drag';
      }else if(this.tabEls.length==3){
          this.tabEls[0].style.webkitAppRegion = 'no-drag';
      }
    }

    setTabCloseEventListener(tabEl) {
      tabEl
        .querySelector(".wanroi-tab-close")
        .addEventListener("click", (_) => this.removeTab(tabEl));
    }

    get activeTabEl() {
      return this.el.querySelector(".wanroi-tab[active]");
    }

    hasActiveTab() {
      return !!this.activeTabEl;
    }

    setCurrentTab(tabEl) {
      const activeTabEl = this.activeTabEl;
      if (activeTabEl === tabEl) return;
      if (activeTabEl) activeTabEl.removeAttribute("active");
      tabEl.setAttribute("active", "");
      this.emit("activeTabChange", { tabEl });
    }

    removeTab(tabEl,isSeparate=false) {
      if (tabEl === this.activeTabEl) {
        if (tabEl.nextElementSibling === document.querySelector(".add-btn")) {
          if (tabEl.previousElementSibling) {
            this.setCurrentTab(tabEl.previousElementSibling);
          }
        } else {
          if (tabEl.nextElementSibling) {
            this.setCurrentTab(tabEl.nextElementSibling);
          } else if (tabEl.previousElementSibling) {
            this.setCurrentTab(tabEl.previousElementSibling);
          }
        }
      }
      tabEl.parentNode.removeChild(tabEl);
      this.emit("tabRemove", { tabEl,isSeparate});
      this.cleanUpPreviouslyDraggedTabs();
      this.layoutTabs();
      this.setupDraggabilly();
    }

    updateTab(tabEl, tabProperties) {
      tabEl.querySelector(".wanroi-tab-title").textContent =
        tabProperties.title;

      const faviconEl = tabEl.querySelector(".wanroi-tab-favicon");
      if (tabProperties.favicon) {
        faviconEl.style.backgroundImage = `url('${tabProperties.favicon}')`;
        faviconEl.removeAttribute("hidden", "");
      } else {
        faviconEl.setAttribute("hidden", "");
        faviconEl.removeAttribute("style");
      }

      if (tabProperties.id) {
        tabEl.setAttribute("data-tab-id", tabProperties.id);
      }
    }

    cleanUpPreviouslyDraggedTabs() {
      this.tabEls.forEach((tabEl) =>
        tabEl.classList.remove("wanroi-tab-was-just-dragged")
      );
    }

    setupDraggabilly() {
      if(this.tabEls.length <= 2) {
        this.draggabillies.forEach((d) => d.destroy());

        return
      }
      const tabEls = this.tabEls;
      const tabPositions = this.tabPositions;

      if (this.isDragging) {
        this.isDragging = false;
        this.el.classList.remove("wanroi-tabs-is-sorting");
        this.draggabillyDragging.element.classList.remove(
          "wanroi-tab-is-dragging"
        );
        this.draggabillyDragging.element.style.transform = "";
        this.draggabillyDragging.dragEnd();
        this.draggabillyDragging.isDragging = false;
        this.draggabillyDragging.positionDrag = noop; // Prevent Draggabilly from updating tabEl.style.transform in later frames
        this.draggabillyDragging.destroy();
        this.draggabillyDragging = null;
      }

      this.draggabillies.forEach((d) => d.destroy());

      tabEls.forEach((tabEl, originalIndex) => {
        const originalTabPositionX = tabPositions[originalIndex];
        const draggabilly = new Draggabilly(tabEl, {
          handle: ".wanroi-tab-drag-handle",
        });

        this.draggabillies.push(draggabilly);

        draggabilly.on("pointerDown", (_) => {
          this.setCurrentTab(tabEl);
        });

        draggabilly.on("dragStart", (_) => {
          this.isDragging = true;
          this.draggabillyDragging = draggabilly;
          tabEl.classList.add("wanroi-tab-is-dragging");
          this.el.classList.add("wanroi-tabs-is-sorting");
        });

        draggabilly.on("dragEnd", (_) => {
          this.isDragging = false;
          const finalTranslateX = parseFloat(tabEl.style.left, 10);
          tabEl.style.transform = `translate3d(0, 0, 0)`;

          // Animate dragged tab back into its place
          requestAnimationFrame((_) => {
            tabEl.style.left = "0";
            tabEl.style.transform = `translate3d(${finalTranslateX}px, 0, 0)`;

            requestAnimationFrame((_) => {
              tabEl.classList.remove("wanroi-tab-is-dragging");
              this.el.classList.remove("wanroi-tabs-is-sorting");

              tabEl.classList.add("wanroi-tab-was-just-dragged");

              requestAnimationFrame((_) => {
                tabEl.style.transform = "";

                this.layoutTabs();
                this.setupDraggabilly();
              });
            });
          });
        });

        draggabilly.on("dragMove", (event, pointer, moveVector) => {
          // Current index be computed within the event since it can change during the dragMove
          if (this.tabEls.length > 2)
            if (pointer.clientY > 60) {
              const title =  tabEl.querySelector('.wanroi-tab-title').innerText;
              const favicon = tabEl.querySelector('.wanroi-tab-favicon').style.backgroundImage;
              const imageUrl = favicon.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
              const obj = {
                id:tabEl.id,
                favicon:imageUrl,
                title:title
              }
              ipc_separateTab(obj);
              this.removeTab(tabEl,true)
              return;
            } 

          const tabEls = this.tabEls;
          const currentIndex = tabEls.indexOf(tabEl);

          const currentTabPositionX = originalTabPositionX + moveVector.x;
          const destinationIndexTarget = closest(
            currentTabPositionX,
            tabPositions
          );

          if(destinationIndexTarget==this.tabEls.length-1){
            this.removeTab(tabEl); 
            return
          }

          const destinationIndex = Math.max(
            0,
            Math.min(tabEls.length, destinationIndexTarget)
          );

          if (currentIndex !== destinationIndex) {
            this.animateTabMove(tabEl, currentIndex, destinationIndex);
          }
        });
      });
    }

    animateTabMove(tabEl, originIndex, destinationIndex) {
      if (destinationIndex < originIndex) {
        tabEl.parentNode.insertBefore(tabEl, this.tabEls[destinationIndex]);
      } else {
        tabEl.parentNode.insertBefore(tabEl, this.tabEls[destinationIndex + 1]);
      }
      this.emit("tabReorder", { tabEl, originIndex, destinationIndex });
      this.layoutTabs();
    }
  }


