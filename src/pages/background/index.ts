// /pages/background/index.ts
import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';
 
reloadOnUpdate('pages/background');
reloadOnUpdate('pages/content/style.scss');

// Function to check if current tab is a new tab
function isNewTab(url: string | undefined): boolean {
  if (!url) return true;
  const storeRegexPatterns = [
    /^about:newtab$/,
    /^chrome:\/\/newtab\//,
    /^https:\/\/[^/]*chromewebstore\.google\.com/,
    /^https:\/\/chrome\.google\.com\/.*webstore/,
    /^chrome:\/\/extensions\//,
  ];
  return storeRegexPatterns.some((pattern) => pattern.test(url));
}

// Function to setup popup for a tab
async function setupPopupForTab(tabId: number, url: string | undefined) {
  const isCurrentTabNewTab = isNewTab(url);

  await chrome.action.setPopup({
    tabId,
    popup: isCurrentTabNewTab ? 'src/pages/popup/index.html' : '',
  });
}

// Function to handle browser action click
chrome.action.onClicked.addListener(async () => {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab?.id) {
      console.error('No active tab found');
      return;
    }

    const isCurrentTabNewTab = isNewTab(tab.url);

    if (isCurrentTabNewTab) {
      // New tab'de popup'ı aç
      await chrome.action.openPopup();
    } else {
      // Normal tab'de inject edilmiş extension'ı aç/gizle
      await chrome.tabs.sendMessage(tab.id, {
        message: 'browser_action_clicked',
      });
    }
  } catch (error) {
    console.error('Error in browser action:', error);
  }
});

// Tab değişikliklerini dinle ve popup'ı ayarla
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    await setupPopupForTab(tab.id!, tab.url);
  } catch (error) {
    console.error('Error setting up popup for activated tab:', error);
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' || changeInfo.url) {
    await setupPopupForTab(tabId, tab.url);
  }
});

export {};
