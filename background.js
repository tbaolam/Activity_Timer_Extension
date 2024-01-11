
let countdown;
let endTime;
//let youtubeTabCount = 0;
//let facebookTabCount = 0;
let countedTabs = {};
let tabCounts = {};
let socialMediaHostnames = ['www.facebook.com', 'www.youtube.com', 'www.twitch.tv', 'www.instagram.com', 'www.amazon.com'];

/*chrome.runtime.onMessage.addListener((request, _sender, _sendResponse) => {
  // Reset the YouTube and Facebook tab counts
  youtubeTabCount = 0;
  facebookTabCount = 0;
  countedTabs = {};

  if (request.action === 'startTimer') {
    const minutes = request.minutes;

    // Store the updated counts in local storage
    chrome.storage.local.set({ 'youtubeTabCount': youtubeTabCount, 'facebookTabCount': facebookTabCount });
    // Send to the popup script for display
    chrome.runtime.sendMessage({ action: 'updateYoutubeTabCount', count: youtubeTabCount });
    chrome.runtime.sendMessage({ action: 'updateFacebookTabCount', count: facebookTabCount });
    
    endTime = Date.now() + minutes * 60000;
    startCountdown();
  }
});*/

chrome.runtime.onMessage.addListener((request, _sender, _sendResponse) => {
  // Reset tab counts
  countedTabs = {};
  tabCounts = {};

  if (request.action === 'startTimer') {
    const minutes = request.minutes;
    // Store the updated counts in local storage
    chrome.storage.local.set({ 'tabCounts': tabCounts });

    // Send to the popup script for display
    chrome.runtime.sendMessage({ action: 'updateTabCounts', counts: tabCounts });

    endTime = Date.now() + minutes * 60000;
    startCountdown();
  }
});

chrome.tabs.onUpdated.addListener((_tabId, _changeInfo, tab) => {
  const url = new URL(tab.url);
  const hostname = url.hostname;

  if (socialMediaHostnames.includes(hostname)) {
    if (!tabCounts[hostname]) {
      tabCounts[hostname] = 0;
    }
    if (!countedTabs[tab.url]) {
      tabCounts[hostname]++;
      countedTabs[tab.url] = true;
      chrome.storage.local.set({ 'tabCounts': tabCounts });
    }

    // Send to the popup script for display
    if (chrome.runtime.sendMessage)
      chrome.runtime.sendMessage({ action: 'updateTabCounts', counts: tabCounts });
}
});

/*// Listen for tab updates, specifically when a tab is updated (e.g., user navigates to a new URL)
chrome.tabs.onUpdated.addListener((_tabId, _changeInfo, tab) => {
  // Check if the tab's URL contains 'youtube.com'
  if (tab.url && tab.url.includes('youtube.com')) {
    if (!countedTabs[tab.url]){
      youtubeTabCount++;
      countedTabs[tab.url] = true;
      chrome.storage.local.set({'youtubeTabCount': youtubeTabCount});

      // sending it to the popup script for display.
      if (chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage({ action: 'updateYoutubeTabCount', count: youtubeTabCount });
      }
    }
  }

  // Check if the tab's URL contains 'facebook.com'
  if (tab.url && tab.url.includes('facebook.com')) {
    if (!countedTabs[tab.url]){
      facebookTabCount++;
      countedTabs[tab.url] = true;
      chrome.storage.local.set({'facebookTabCount': facebookTabCount});

      // sending it to the popup script for display.
      if (chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage({ action: 'updateFacebookTabCount', count: facebookTabCount });
      }
    }
  }
});*/

function startCountdown() {
  clearInterval(countdown);

  function updateDisplay() {
    let totalTabCount = Object.values(tabCounts).reduce((a, b) => a + b, 0);
    const currentTime = Date.now();
    const remainingTime = endTime - currentTime;
    if (remainingTime <= 0) {
      clearInterval(countdown);
      if (chrome.notifications.create) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'images/icon48.png',
          title: 'Session Complete!',
          message: `You were distracted by ${totalTabCount} websites during your session.`
          //message: `You visited ${youtubeTabCount} YouTube tabs and ${facebookTabCount} Facebook tabs during your session.`,
        });
      }
    } else {
      // Update the timer display in the popup (if it's open)
      if (chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage({ action: 'updateTimerDisplay', remainingTime });
      }
    }
  }

  updateDisplay();
  countdown = setInterval(updateDisplay, 1000);
}
