document.addEventListener('DOMContentLoaded', function () {
  const timerInput = document.getElementById('timerInput');
  const startTimerBtn = document.getElementById('startTimer');
  const timerDisplay = document.getElementById('timerDisplay');
  //let countdown;

  startTimerBtn.addEventListener('click', async function () {
    const minutes = parseInt(timerInput.value);
    if (!isNaN(minutes) && minutes > 0) {
      // Send a message to the background script and wait for a response if needed
      const response = await sendMessageToBackground({ action: 'startTimer', minutes });
      // Handle the response if necessary
    }
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateTimerDisplay') {
      const remainingTime = request.remainingTime;
      const minutes = Math.floor(remainingTime / 60000);
      const seconds = Math.floor((remainingTime % 60000) / 1000);
      timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  });

  function sendMessageToBackground(message) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, (response) => {
        resolve(response);
      });
    });
  }

});
