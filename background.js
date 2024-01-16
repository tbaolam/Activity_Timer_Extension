
let countdown;
let endTime;
//let youtubeTabCount = 0;
//let facebookTabCount = 0;
let countedTabs = {};
let tabCounts = {};
let socialMediaHostnames = ['www.facebook.com', 'www.youtube.com', 'www.twitch.tv', 'www.instagram.com', 'www.amazon.com'];
// Loop through socialMediaHostnames
for (const hostname of socialMediaHostnames) {
  // Store the social media hostnames in local storage
  chrome.storage.local.set({ 'socialMediaHostnames': socialMediaHostnames });
}



chrome.runtime.onMessage.addListener((request, _sender, _sendResponse) => {
  // Reset tab counts
  countedTabs = {};
  tabCounts = {};

  if (request.action === 'addWebsite') {
    const website = request.website;
    socialMediaHostnames.push(website);
    chrome.storage.local.set({ 'socialMediaHostnames': socialMediaHostnames });
  }

  if (request.action === 'startTimer') {
    const minutes = request.minutes;
    // Store the updated counts in local storage
    chrome.storage.local.set({ 'tabCounts': tabCounts });

    // Send to the popup script for display
    chrome.runtime.sendMessage({ action: 'updateTabCounts', counts: tabCounts });

    endTime = Date.now() + minutes * 60000;
    startCountdown();

    
  }

  // Always call sendResponse, even if you don't have any data to send back.
  sendResponse({});
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
