function addLocationObserver(callback) {

  // Options for the observer (which mutations to observe)
  const config = { attributes: false, childList: true, subtree: true }

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback)

  // Start observing the target node for configured mutations
  observer.observe(document.body, config)
}



function hideSubReddits() {
	const subRedditFeeds = document.querySelector('shreddit-feed');
	chrome.storage.local.get(['subRedditList'], function (items) {
		if (typeof items.subRedditList == 'undefined') {
			return;
		}
		var nodeList = subRedditFeeds.querySelectorAll('article');
		for (let i = 0; i < nodeList.length; i++) {
			var spanNode = nodeList[i].querySelector('shreddit-post');
			if(spanNode !== null && items.subRedditList.includes(spanNode.getAttribute('subreddit-name'))) {
				nodeList[i].parentElement.removeChild(nodeList[i]);
			}
		}
	});	
}

function observerCallback() {
	if (window.location.href.startsWith('https://www.reddit.com/r/popular/')) {
		hideSubReddits();
	}
}

addLocationObserver(observerCallback);
