
document.addEventListener('DOMContentLoaded', function () {
  const timerInput = document.getElementById('timerInput');
  const startTimerBtn = document.getElementById('startTimer');
  const timerDisplay = document.getElementById('timerDisplay');
  const youtubeTabCountDisplay = document.getElementById('youtubeTabCount');
  const facebookTabCountDisplay = document.getElementById('facebookTabCount'); // Add Facebook tab count display element

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

      /*
      const tabCountDisplay = document.getElementById(`${hostname}TabCount`);
      if (tabCountDisplay) {
        tabCountDisplay.textContent = `Tabs Count: ${count}`;
      }*/
    }
  }
});
  
  /*chrome.storage.local.get(['youtubeTabCount', 'facebookTabCount'], function (result) {
    if (result.youtubeTabCount !== undefined) {
      youtubeTabCountDisplay.textContent = `Tabs Count: ${result.youtubeTabCount}`;
    }
    if (result.facebookTabCount !== undefined) {
      facebookTabCountDisplay.textContent = `Tabs Count: ${result.facebookTabCount}`;
    }
  });*/

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'updateTimerDisplay') {
    const remainingTime = request.remainingTime;
    updateTimerDisplay(remainingTime);
  }
  else if (request.action === 'updateTabCounts') {
    for (const [hostname, count] of Object.entries(request.counts)) {
      updateTabCountDisplay(hostname, count);
      /*
      const tabCountDisplay = document.getElementById(`${hostname}TabCount`);
      if (tabCountDisplay) {
        tabCountDisplay.textContent = `Tabs Count: ${count}`;
      }*/
    }
  }
});

  /*chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'updateTimerDisplay') {
      const remainingTime = request.remainingTime;
      updateTimerDisplay(remainingTime);
    } else if (request.action === 'updateYoutubeTabCount') {
      // Update the YouTube tab count
      const youtubeTabCount = request.count;
      youtubeTabCountDisplay.textContent = `Tabs Count: ${youtubeTabCount}`;
    } else if (request.action === 'updateFacebookTabCount') {
      // Update the Facebook tab count
      const facebookTabCount = request.count;
      facebookTabCountDisplay.textContent = `Tabs Count: ${facebookTabCount}`;
    }
  });*/

  function sendMessageToBackground(message) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, (response) => {
        resolve(response);
      });
    });
  }

  function updateTabCountDisplay(hostname, count) {
    let tabCountDisplay = document.getElementById(`${hostname}TabCount`);
  
    if (!tabCountDisplay) {
      tabCountDisplay = document.createElement('div');
      tabCountDisplay.id = `${hostname}TabCount`;
      document.body.appendChild(tabCountDisplay);
    }
  
    tabCountDisplay.textContent = `${hostname} Tabs Count: ${count}`;
  }

});
