document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector(".button");
    const circle = document.querySelector(".circle");
    const timeTracker = document.getElementById("tracker");
  
    let isDarkMode = false;
  
    button.addEventListener("click", () => {
        isDarkMode = !isDarkMode;
    
        const scriptFile = isDarkMode ? "appOn.js" : "appOff.js";
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: [scriptFile],
          });
        });

        circle.style.left = isDarkMode ? "50%" : "2px";
      });
  
    chrome.storage.local.get("websites", (data) => {
      const websites = data.websites || {};
      for (const [site, details] of Object.entries(websites)) {
        const row = document.createElement("div");
        row.innerHTML = `
          <img src="${details.favicon || ""}" alt="" width="16">
          <span>${site}</span>
          <span>${(details.timeSpent / 1000).toFixed(0)} seconds</span>
        `;
        timeTracker.appendChild(row);
      }
    });
  });
  