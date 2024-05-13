chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const url = new URL(tabs[0].url);
    const fullPath = url.hostname + url.pathname;
    document.getElementById('website').textContent = 'Website: ' + url.hostname;
    document.getElementById('path').textContent = 'Path: ' + url.pathname;

    chrome.storage.local.get([fullPath], function(result) {
        const timeSpent = result[fullPath] || 0;
        const hours = Math.floor(timeSpent / 3600000);
        const minutes = Math.floor((timeSpent % 3600000) / 60000);
        const seconds = ((timeSpent % 60000) / 1000).toFixed(0);

        document.getElementById('timespent').textContent ="Time Spent = "+hours+" hr  "+minutes+" min "+seconds+" sec"; 
    });
});
