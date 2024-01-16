document.addEventListener('DOMContentLoaded', function () {
    const websiteList = document.getElementById('websiteList');

    chrome.storage.local.get(['socialMediaHostnames'], function (result) {
        if (result.socialMediaHostnames !== undefined) {
            for (const hostname of result.socialMediaHostnames) {
                const listItem = document.createElement('li');
                listItem.textContent = hostname;
                websiteList.appendChild(listItem);
            }
        }
    });
});