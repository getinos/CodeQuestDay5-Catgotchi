// background.js
console.log("Cat background script loaded!");

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background received message:", message);
  
  if (message.action === "healthy_advice") {
    console.log("Cat's advice:", message.content);
    
    // Store in local storage
    chrome.storage.local.set({ "cat_advice": message.content }, function() {
      console.log("Advice saved to storage");
    });
    
    // Set badge
    chrome.action.setBadgeText({ text: "!" });
    chrome.action.setBadgeBackgroundColor({ color: "#FF4500" });
    
    // Show notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon.png',
      title: "Cat Advice 🐾",
      message: message.content
    });
    
    // Forward to popup if it's open
    chrome.runtime.sendMessage({ 
      action: "healthy_advice", 
      content: message.content 
    }).catch(err => {
      // This error is expected if popup is not open, so we can ignore it
      console.log("Could not send to popup (probably not open)");
    });
    
    // Automatically open the popup when advice is received
    openPopup();
  }
  
  // Always return true for asynchronous response
  return true;
});

// Function to programmatically open the popup
function openPopup() {
  chrome.windows.getCurrent(function(window) {
    chrome.action.getPopup({}, function(popupUrl) {
      // If popup URL is defined in manifest
      if (popupUrl) {
        // Get the current extension
        chrome.management.getSelf(function(extensionInfo) {
          // Create a popup window
          chrome.windows.create({
            url: popupUrl,
            type: 'popup',
            width: 340, // Slightly wider than the popup width (300px + padding)
            height: 240, // Slightly taller than the popup height (200px + padding)
            focused: true,
            top: window.top + 50,
            left: window.left + (window.width - 340)/2 // Center horizontally
          });
        });
      }
    });
  });
}

// Clear badge when popup is opened
chrome.action.onClicked.addListener(() => {
  chrome.action.setBadgeText({ text: "" });
});

// Listen for when the popup is opened
chrome.runtime.onConnect.addListener(function(port) {
  if (port.name === "popup") {
    // Clear the badge when popup connects
    chrome.action.setBadgeText({ text: "" });
    
    port.onDisconnect.addListener(function() {
      console.log("Popup closed");
    });
  }
});