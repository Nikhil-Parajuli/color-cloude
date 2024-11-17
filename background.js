chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({
      mode: 'normal',
      siteSettings: {}
    });
  });
  
  // Handle keyboard shortcuts
  chrome.commands.onCommand.addListener(function(command) {
    if (command === 'toggle-enhancement') {
      chrome.storage.local.get('mode', function(result) {
        const currentMode = result.mode || 'normal';
        const modes = ['normal', 'protanopia', 'deuteranopia', 'tritanopia'];
        const nextMode = modes[(modes.indexOf(currentMode) + 1) % modes.length];
        
        chrome.storage.local.set({mode: nextMode});
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'updateMode',
            mode: nextMode
          });
        });
      });
    }
  });