
let countdown;
let endTime;
let youtubeTabCount = 0;
let countedTabs = {};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Reset the YouTube tab count
  youtubeTabCount = 0;
  countedTabs = {};

  if (request.action === 'startTimer') {
    const minutes = request.minutes;

    // Store the updated count in local storage
    chrome.storage.local.set({ 'youtubeTabCount': youtubeTabCount });
    // Send to the popup script for display
    chrome.runtime.sendMessage({ action: 'updateYoutubeTabCount', count: youtubeTabCount });
    
    endTime = Date.now() + minutes * 60000;
    startCountdown();
  }
});


// Listen for tab updates, specifically when a tab is updated (e.g., user navigates to a new URL)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the tab's URL contains 'youtube.com'
  if (tab.url && tab.url.includes('youtube.com')) {
    if (!countedTabs[tab.url]){
      youtubeTabCount++;
      countedTabs[tab.url] = true;
      chrome.storage.local.set({'youtubeTabCount': youtubeTabCount});

      // sending it to the popup script for display.
      chrome.runtime.sendMessage({ action: 'updateYoutubeTabCount', count: youtubeTabCount });
    }
  }
});

function startCountdown() {
  clearInterval(countdown);

  function updateDisplay() {
    const currentTime = Date.now();
    const remainingTime = endTime - currentTime;
    if (remainingTime <= 0) {
      clearInterval(countdown);
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'images/icon48.png',
        title: 'Timer Expired',
        message: 'Your timer has expired!',
      });
    } else {
      // Update the timer display in the popup (if it's open)
      chrome.runtime.sendMessage({ action: 'updateTimerDisplay', remainingTime });
    }
  }

  updateDisplay();
  countdown = setInterval(updateDisplay, 1000);
}
