setInterval(() => {
    chrome.storage.local.get("websites", (data) => {
      const websites = data.websites || {};
      const domain = new URL(window.location.href).hostname;
  
      if (websites[domain] && websites[domain].startTime) {
        const timeSpent = Date.now() - websites[domain].startTime;
        websites[domain].timeSpent += timeSpent;
        websites[domain].startTime = Date.now();
        chrome.storage.local.set({ websites });
      }
    });
  }, 1000);