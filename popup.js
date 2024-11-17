document.addEventListener('DOMContentLoaded', function() {
    const colorMode = document.getElementById('colorMode');
    const siteSpecific = document.getElementById('siteSpecific');
    const testMode = document.getElementById('testMode');
    const previewBox = document.getElementById('previewBox');
  
    // Load saved settings
    chrome.storage.local.get(['mode', 'siteSettings'], function(result) {
      if (result.mode) {
        colorMode.value = result.mode;
        applyColorMode(result.mode);
      }
      
      // Check if current site has specific settings
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentUrl = new URL(tabs[0].url).hostname;
        if (result.siteSettings && result.siteSettings[currentUrl]) {
          siteSpecific.checked = true;
        }
      });
    });
  
    // Mode change handler
    colorMode.addEventListener('change', function() {
      const mode = colorMode.value;
      chrome.storage.local.set({mode: mode});
      applyColorMode(mode);
      
      // Apply to current tab
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'updateMode',
          mode: mode
        });
      });
    });
  
    // Site-specific settings handler
    siteSpecific.addEventListener('change', function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentUrl = new URL(tabs[0].url).hostname;
        chrome.storage.local.get('siteSettings', function(result) {
          const settings = result.siteSettings || {};
          if (siteSpecific.checked) {
            settings[currentUrl] = colorMode.value;
          } else {
            delete settings[currentUrl];
          }
          chrome.storage.local.set({siteSettings: settings});
        });
      });
    });
  
    // Test mode handler
    testMode.addEventListener('click', function() {
      chrome.tabs.create({
        url: chrome.runtime.getURL('test.html')
      });
    });
  });
  
  function applyColorMode(mode) {
    const filters = {
      normal: 'none',
      protanopia: 'url(#protanopia)',
      deuteranopia: 'url(#deuteranopia)',
      tritanopia: 'url(#tritanopia)'
    };
    
    previewBox.style.filter = filters[mode];
  }