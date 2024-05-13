let startTime = Date.now();
let activeUrl = '';
let activePath = '';  // New variable to keep track of the path

function updateTime(url, path) {
    const now = Date.now();
    const timeSpent = now - startTime;
    startTime = now;
    const fullPath = url + path; // Combine domain and path

    if (activePath && timeSpent > 0) {
        chrome.storage.local.get([activePath], function(result) {
            const currentTime = result[activePath] ? result[activePath] : 0;
            chrome.storage.local.set({ [activePath]: currentTime + timeSpent });
        });
    }
    activeUrl = url;
    activePath = fullPath;
}

chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        if (tab.url) {
            const url = new URL(tab.url);
            updateTime(url.hostname, url.pathname);
        }
    });
});

chrome.windows.onFocusChanged.addListener(function(windowId) {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        updateTime('', ''); // No active window
    } else {
        chrome.tabs.query({ active: true, windowId: windowId }, function(tabs) {
            if (tabs[0] && tabs[0].url) {
                const url = new URL(tabs[0].url);
                updateTime(url.hostname, url.pathname);
            }
        });
    }
});
