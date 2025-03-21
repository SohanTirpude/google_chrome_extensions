chrome.action.onClicked.addListener(openSettingsTab);

function openSettingsTab() {
  chrome.tabs.create({ url: 'settings/index.html' });
}
