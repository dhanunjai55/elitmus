document.getElementById('addButton').addEventListener('click', function() {
  const site = document.getElementById('siteInput').value;
  chrome.storage.sync.get(['blockedSites'], function(data) {
    const blockedSites = data.blockedSites || [];
    if (!blockedSites.includes(site)) {
      blockedSites.push(site);
      chrome.storage.sync.set({blockedSites: blockedSites}, function() {
        updateList(blockedSites);
        document.getElementById('siteInput').value = ''; // clear input
      });
    }
  });
});

function updateList(sites) {
  const listElement = document.getElementById('siteList');
  listElement.innerHTML = ''; // clear current list
  sites.forEach(function(site) {
    const li = document.createElement('li');
    li.textContent = site;
    listElement.appendChild(li);
  });
}

// On load, display the current list
chrome.storage.sync.get(['blockedSites'], function(data) {
  updateList(data.blockedSites || []);
});
