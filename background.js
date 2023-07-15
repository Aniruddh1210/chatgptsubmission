// Add event listener to the button
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message === 'submitFile') {
        // Create file input element
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.txt, .js, .py, .html, .css, .json, .csv';
  
      // Function to handle file selection
      fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[
                0
            ];
        const reader = new FileReader();
  
        // Read file as text
        reader.readAsText(file);
  
        reader.onload = async (event) => {
          const fileText = event.target.result;
          const chunkSize = 15000;
          const numChunks = Math.ceil(fileText.length / chunkSize);
  
          // Iterate through chunks and submit to conversation
          for (let i = 0; i < numChunks; i++) {
            const start = i * chunkSize;
            const end = (i + 1) * chunkSize;
            const chunk = fileText.substring(start, end);
  
            // Send message to content script
            chrome.tabs.query({ active: true, currentWindow: true
                    }, function(tabs) {
              chrome.tabs.sendMessage(tabs[
                            0
                        ].id,
                        {
                message: 'submitChunk',
                chunk,
                part: i + 1,
                filename: file.name
                        });
                    });
  
            // Update progress bar
            chrome.tabs.query({ active: true, currentWindow: true
                    }, function(tabs) {
              chrome.tabs.sendMessage(tabs[
                            0
                        ].id,
                        {
                message: 'updateProgressBar',
                progress: ((i + 1) / numChunks) * 100
                        });
                    });
  
            // Check if chatgpt is ready
            let chatgptReady = false;
            while (!chatgptReady) {
              await new Promise((resolve) => setTimeout(resolve,
                        1000));
              chatgptReady = !document.querySelector('.text-2xl > span:not(.invisible)');
                    }
                }
                // Set progress bar to blue
          chrome.tabs.query({ active: true, currentWindow: true
                }, function(tabs) {
            chrome.tabs.sendMessage(tabs[
                        0
                    ].id,
                    {
              message: 'setProgressBarColor',
              color: 'blue'
                    });
                });
            };
        });
  
      // Trigger file input click
      fileInput.click();
    }
});
  