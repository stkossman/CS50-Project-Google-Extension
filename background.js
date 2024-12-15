const websiteData = {};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ websites: {} });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const domain = new URL(tab.url).hostname;
    const startTime = Date.now();

    chrome.storage.local.get("websites", (data) => {
      const websites = data.websites || {};
      if (!websites[domain]) {
        websites[domain] = { timeSpent: 0, favicon: tab.favIconUrl };
      }

      websites[domain].startTime = startTime;
      chrome.storage.local.set({ websites });
    });
  }
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  chrome.storage.local.get("websites", (data) => {
    const websites = data.websites || {};

    for (const domain in websites) {
      if (websites[domain].startTime) {
        const timeSpent = Date.now() - websites[domain].startTime;
        websites[domain].timeSpent += timeSpent;
        delete websites[domain].startTime;
      }
    }

    chrome.storage.local.set({ websites });
  });
});
