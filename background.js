// Initialize a local cache for blocked sites
let blockedSites = [];

// Load the blocked sites from storage initially and update when changes occur
chrome.storage.sync.get(['blockedSites'], function(data) {
    blockedSites = data.blockedSites || [];
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === "sync" && changes.blockedSites) {
        blockedSites = changes.blockedSites.newValue || [];
    }
});

// Time tracking variables
let startTime = Date.now();
let activeUrl = '';
let activePath = '';

// Update time spent on sites
function updateTime(url, path) {
    const now = Date.now();
    const timeSpent = now - startTime;
    startTime = now;
    const fullPath = url + path;

    if (activePath && timeSpent > 0) {
        chrome.storage.local.get([activePath], function(result) {
            const currentTime = result[activePath] ? result[activePath] : 0;
            chrome.storage.local.set({ [activePath]: currentTime + timeSpent });
        });
    }
    activeUrl = url;
    activePath = fullPath;
}

// Listener for tab activation to handle time tracking
chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        if (tab.url) {
            const url = new URL(tab.url);
            if (blockedSites.includes(url.hostname.replace('www.', ''))) {
                chrome.tabs.update(tab.id, {url: chrome.runtime.getURL("blocked.html")});
            } else {
                updateTime(url.hostname, url.pathname);
            }
        }
    });
});

// Listener for window focus changes to handle time tracking and blocking
chrome.windows.onFocusChanged.addListener(function(windowId) {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        updateTime('', ''); // No active window, so pause time tracking
    } else {
        chrome.tabs.query({ active: true, windowId: windowId }, function(tabs) {
            if (tabs[0] && tabs[0].url) {
                const url = new URL(tabs[0].url);
                if (blockedSites.includes(url.hostname.replace('www.', ''))) {
                    chrome.tabs.update(tabs[0].id, {url: chrome.runtime.getURL("blocked.html")});
                } else {
                    updateTime(url.hostname, url.pathname);
                }
            }
        });
    }
});

// Blocking requests if the site is on the blocked list
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    const url = new URL(details.url);
    const hostname = url.hostname.replace('www.', '');

    if (blockedSites.includes(hostname)) {
        return { redirectUrl: chrome.runtime.getURL("blocked.html") };
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);
