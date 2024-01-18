document.addEventListener('DOMContentLoaded', function () {
    loadWebsites();
});

function loadWebsites() {
    const websiteList = document.getElementById('websiteList');
    websiteList.innerHTML = ''; // Clear the list

    chrome.storage.local.get(['socialMediaHostnames'], function (result) {
        if (result.socialMediaHostnames !== undefined) {
            for (const hostname of result.socialMediaHostnames) {
                const listItem = document.createElement('li');
                listItem.textContent = hostname;

                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.addEventListener('click', function () {
                    chrome.runtime.sendMessage({ action: 'removeWebsite', website: hostname }, function() {
                        loadWebsites(); // Reload the list after removing a website
                    });
                });

                listItem.appendChild(removeButton);
                websiteList.appendChild(listItem);
            }
        }
    });
}