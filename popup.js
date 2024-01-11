
document.addEventListener('DOMContentLoaded', function () {
  const timerInput = document.getElementById('timerInput');
  const startTimerBtn = document.getElementById('startTimer');
  const timerDisplay = document.getElementById('timerDisplay');
  const websiteNames = {
    'www.facebook.com': 'Facebook',
    'www.youtube.com': 'YouTube',
    'www.twitch.tv': 'Twitch',
    'www.instagram.com': 'Instagram',
    'www.amazon.com': 'Amazon'
  }

  // Function to update the timer display
  function updateTimerDisplay(remainingTime) {
    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Call the function to update the timer display immediately
  updateTimerDisplay(0);

  startTimerBtn.addEventListener('click', async function () {
    const minutes = parseInt(timerInput.value);
    if (!isNaN(minutes) && minutes > 0) {
      // Send a message to the background script and wait for a response if needed
      const response = await sendMessageToBackground({ action: 'startTimer', minutes });
      // Handle the response if necessary
      
    }
  });

chrome.storage.local.get(['tabCounts'], function (result) {
  if (result.tabCounts !== undefined) {
    for (const [hostname, count] of Object.entries(result.tabCounts)) {
      updateTabCountDisplay(hostname, count);
    }
  }
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'updateTimerDisplay') {
    const remainingTime = request.remainingTime;
    updateTimerDisplay(remainingTime);
  }
  else if (request.action === 'updateTabCounts') {
    for (const [hostname, count] of Object.entries(request.counts)) {
      updateTabCountDisplay(hostname, count);
    }
  }
});

  function sendMessageToBackground(message) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, (response) => {
        resolve(response);
      });
    });
  }

  function updateTabCountDisplay(hostname, count) {
    let websiteName = websiteNames[hostname] || hostname;
    let tabCountDisplay = document.getElementById(`${hostname}TabCount`);
  
    if (!tabCountDisplay) {
      tabCountDisplay = document.createElement('div');
      tabCountDisplay.id = `${hostname}TabCount`;
      document.body.appendChild(tabCountDisplay);
    }
  
    tabCountDisplay.textContent = `${websiteName} Tabs Count: ${count}`;
  }

});
