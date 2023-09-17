let countdown;
let endTime;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startTimer') {
    const minutes = request.minutes;
    endTime = Date.now() + minutes * 60000;
    startCountdown();
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
