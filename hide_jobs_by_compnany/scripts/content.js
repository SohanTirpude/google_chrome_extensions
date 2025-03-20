function addLocationObserver(callback) {

  // Options for the observer (which mutations to observe)
  const config = { attributes: false, childList: true, subtree: true }

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback)

  // Start observing the target node for configured mutations
  observer.observe(document.body, config)
}

function hideJobListings() {
	console.log("called function");
	const jobListings = document.querySelector('div.scaffold-layout__list ');
	chrome.storage.local.get(['companyList'], function (items) {
		if (typeof items.companyList == 'undefined') {
			return;
		}
		var nodeList = jobListings.querySelectorAll('li.scaffold-layout__list-item');
		for (let i = 0; i < nodeList.length; i++) {
			var spanNode = nodeList[i].querySelector('div.artdeco-entity-lockup__subtitle > span');
			if(spanNode !== null && items.companyList.find((element) => spanNode.innerHTML.includes(element))) {
				if (nodeList[i].querySelector('[data-job-id]').classList.contains('jobs-search-results-list__list-item--active')) {
					nodeList[i+1].querySelector('[data-job-id]').click();
				}
				nodeList[i].parentElement.removeChild(nodeList[i]);				
			}
		}
	});	
}

function observerCallback() {
	if (window.location.href.startsWith('https://www.linkedin.com/jobs/search')) {
		hideJobListings();
	}
}

addLocationObserver(observerCallback);
