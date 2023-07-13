document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    let tabDragged = null;
  
    // Add event listeners for drag start and drag end
    tabs.forEach(tab => {
      tab.addEventListener('dragstart', (event) => {
        tabDragged = event.target;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/html', tab.innerHTML);
      });
  
      tab.addEventListener('dragend', () => {
        tabDragged = null;
      });
    });
  
    // Add event listener for drop
    document.addEventListener('dragover', (event) => {
      event.preventDefault();
    });
  
    document.addEventListener('drop', (event) => {
      event.preventDefault();
      if (tabDragged) {
        const targetTab = event.target.closest('.tab');
        if (targetTab) {
          // Swap the positions of the dragged tab and the target tab
          const temp = targetTab.innerHTML;
          targetTab.innerHTML = tabDragged.innerHTML;
          tabDragged.innerHTML = temp;
        }
      }
    });
  });
  