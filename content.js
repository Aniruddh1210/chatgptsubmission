// Create button
const button = document.createElement('button');
button.innerText = 'Submit File';
button.style.backgroundColor = 'green';
button.style.color = 'white';
button.style.padding = '5px';
button.style.border = 'none';
button.style.borderRadius = '5px';
button.style.margin = '5px';

// Create progress element
const progressElement = document.createElement('div');
progressElement.style.width = '99%';
progressElement.style.height = '5px';
progressElement.style.backgroundColor = 'grey';

// Create progress bar
const progressBar = document.createElement('div');
progressBar.style.width = '0%';
progressBar.style.height = '100%';
progressBar.style.backgroundColor = 'blue';

// Append progress bar to progress element
progressElement.appendChild(progressBar);

// Find target element to insert before
const targetElement = document.querySelector('div.relative.flex.h-full.max-w-full.flex-1.overflow-hidden > div > main > div.absolute.bottom-0 > form > div > div:nth-child(1)');

// Insert button and progress element before the target element
targetElement.parentNode.insertBefore(progressElement, targetElement);
targetElement.parentNode.insertBefore(button, targetElement);

// Add event listener to button
button.addEventListener('click', () => {
    // Send message to background script
    chrome.runtime.sendMessage({ message: 'submitFile' });
});

// Receive messages from background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === 'updateProgressBar') {
        progressBar.style.width = request.progress + '%';
    } else if (request.message === 'setProgressBarColor') {
        progressBar.style.backgroundColor = request.color;
    }
});
