chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
      "id": "sampleContextMenu",
      "title": "Sample Context Menu",
      "contexts": ["selection"]
    });
  });

  chrome.bookmarks.onCreated.addListener(function() {
    alert('Hello, World!');
  });


// function showTags() {
//     alert('Hello, World!');
//     console.log("S"); 
// }

// chrome.browserAction.onClicked.addListener(showTags);
// showTags();