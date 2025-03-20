// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const ADD_ITEM_BUTTON_ID = 'add-item';
const ITEMS_TABLE_ID = 'items';
const TABLE_ITEM_TEMPLATE_ID = 'table-item';
const ERROR_ID = 'error';
const ITEM_TITLE_SELECTOR = '[name="title"]';

/**
 * Adds an entry to the reading list.
 *
 * @param title Title of the entry
 * @param url URL of entry to add
 * @param hasBeenRead If the entry has been read
 */
async function addEntry(title) {
	console.log("START addEntry");
	var items = await chrome.storage.local.get(["companyList"]) || {};
	console.log(items);
	if (typeof items.companyList == 'undefined') {
		items.companyList = []
	}
	if (items.companyList.includes(title)) {
		throw "Company: " + title + " is already blocked.";
	}
	items.companyList.push(title);
	await chrome.storage.local.set({ 'companyList': items.companyList });
	console.log("END addEntry");
}

/**
 * Removes an entry from the reading list.
 *
 * @param url URL of entry to remove.
 */
async function removeEntry(item) {
	console.log("START removeEntry");
	var items = await chrome.storage.local.get(["companyList"]) || {};
	if (typeof items.companyList == 'undefined') {
		items.companyList = []
	}
	items.companyList = items.companyList.filter(function(value) {
		return item !== value
	})
	console.log(items);
	chrome.storage.local.set({ 'companyList': items.companyList });
	console.log("END removeEntry");
	/*
	chrome.storage.local.get(["companyList"], function(result) {
		let companyList = result.companyList || [];
		companyList = companyList.filter(function(value) {
			return item !== value
		})
		chrome.storage.local.set({ 'companyList': companyList });
	});
	*/
}

/**
 * Updates the UI with the current reading list items.
 */
async function updateUI() {
	console.log("START updateUI");
	var items = await chrome.storage.local.get(["companyList"]) || {};
	console.log(items);
	if (typeof items.companyList == 'undefined') {
		items.companyList = []
	}
	const table = document.getElementById(ITEMS_TABLE_ID);
	
	for (const item of items.companyList) {
		// Use existing row if possible, otherwise create a new one.
		const row = document.querySelector(`[data-url="${item}"]`) ||
					document.getElementById(TABLE_ITEM_TEMPLATE_ID).content.cloneNode(true).children[0];

		updateRow(row, item);
		table.appendChild(row);
	}
	
	// Remove any rows that no longer exist
	table.querySelectorAll('tr').forEach((row, i) => {
		// Ignore header row
		if (i === 0) return;
		if (!items.companyList.find((i) => i === row.getAttribute('data-url'))) {
			row.remove();
		}
	});
	console.log("END updateUI");
}

/**
 * Updates a row with the data from item.
 *
 * @param row Table row element to update.
 * @param item Data from reading list API.
 */
function updateRow(row, item) {
	row.setAttribute('data-url', item);

	const titleField = row.querySelector('td:nth-child(1) span');
	titleField.innerText = item;

	const deleteButton = row.querySelector('.delete-button');
	deleteButton.addEventListener('click', async (event) => {
		event.preventDefault();
		await removeEntry(item);
		updateUI();
	});
}

// Add item button click handler
document.getElementById(ADD_ITEM_BUTTON_ID).addEventListener('click', async () => {
	try {
		// Get data from input fields
		const title = document.querySelector(ITEM_TITLE_SELECTOR).value;

		// Attempt to add the entry
		await addEntry(title.trim());
		
		document.querySelector(ITEM_TITLE_SELECTOR).value = "";
		document.getElementById(ERROR_ID).style.display = 'none';
		updateUI();
	} catch (ex) {
		// Something went wrong, show an error
		document.getElementById(ERROR_ID).innerText = ex;
		document.getElementById(ERROR_ID).style.display = 'block';
	}
});

updateUI();
