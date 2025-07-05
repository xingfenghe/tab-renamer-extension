// Tab Renamer Background Script - Option B Implementation

// Listen for tab updates to reapply custom titles
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Only act when the page is fully loaded
  if (changeInfo.status === 'complete' && tab.url) {
    await applyStoredCustomTitle(tab);
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === 'setTitle') {
    await setTabTitle(message.tabId, message.title);
    await updateAllMatchingTabs(message.url, message.title);
  } else if (message.action === 'restoreTitle') {
    await restoreTabTitle(message.tabId);
    await restoreAllMatchingTabs(message.url);
  }
});

// Check if URL can be modified (filter out protected URLs)
function canModifyUrl(url) {
  if (!url) return false;
  
  const protectedSchemes = [
    'chrome://',
    'chrome-extension://',
    'moz-extension://',
    'edge://',
    'about:',
    'data:',
    'javascript:'
  ];
  
  return !protectedSchemes.some(scheme => url.startsWith(scheme));
}

// Set custom title for a specific tab
async function setTabTitle(tabId, title) {
  try {
    // Get tab info first
    const tab = await chrome.tabs.get(tabId);
    
    if (!canModifyUrl(tab.url)) {
      console.log('Cannot modify protected URL:', tab.url);
      return false;
    }
    
    // Inject script to change title
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: (newTitle) => {
        // Store original title if not already stored
        if (!window.__tabRenamerOriginalTitle) {
          window.__tabRenamerOriginalTitle = document.title;
        }
        
        // Set the new title
        document.title = newTitle;
        
        // Store current custom title
        window.__tabRenamerCustomTitle = newTitle;
        
        // Set up title monitoring to prevent page scripts from overriding
        if (!window.__tabRenamerInterval) {
          window.__tabRenamerInterval = setInterval(() => {
            if (window.__tabRenamerCustomTitle && document.title !== window.__tabRenamerCustomTitle) {
              document.title = window.__tabRenamerCustomTitle;
            }
          }, 500); // Check every 500ms
        }
      },
      args: [title]
    });
    
    console.log(`Successfully set title for tab ${tabId}: "${title}"`);
    return true;
    
  } catch (error) {
    console.error(`Failed to set title for tab ${tabId}:`, error);
    return false;
  }
}

// Restore original title for a specific tab
async function restoreTabTitle(tabId) {
  try {
    const tab = await chrome.tabs.get(tabId);
    
    if (!canModifyUrl(tab.url)) {
      return false;
    }
    
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => {
        // Clear the monitoring interval
        if (window.__tabRenamerInterval) {
          clearInterval(window.__tabRenamerInterval);
          window.__tabRenamerInterval = null;
        }
        
        // Clear custom title
        window.__tabRenamerCustomTitle = null;
        
        // Restore original title if available
        if (window.__tabRenamerOriginalTitle) {
          document.title = window.__tabRenamerOriginalTitle;
        }
      }
    });
    
    console.log(`Successfully restored title for tab ${tabId}`);
    return true;
    
  } catch (error) {
    console.error(`Failed to restore title for tab ${tabId}:`, error);
    return false;
  }
}

// Apply stored custom title when tab loads
async function applyStoredCustomTitle(tab) {
  if (!canModifyUrl(tab.url)) {
    return;
  }
  
  const urlKey = normalizeUrl(tab.url);
  const data = await chrome.storage.local.get(['customNames']);
  const customNames = data.customNames || {};
  
  // Check for exact match first
  if (customNames[urlKey]) {
    await setTabTitle(tab.id, customNames[urlKey]);
    return;
  }
  
  // Check for parent URL match (subdomain/path inheritance)
  const parentMatch = findParentUrlMatch(urlKey, customNames);
  if (parentMatch) {
    const { parentUrl, customName } = parentMatch;
    const suffix = getUrlSuffix(urlKey, parentUrl);
    const inheritedName = suffix ? `${customName} - ${suffix}` : customName;
    await setTabTitle(tab.id, inheritedName);
  }
}

// Update all tabs with matching URL
async function updateAllMatchingTabs(urlKey, customName) {
  const tabs = await chrome.tabs.query({});
  
  for (const tab of tabs) {
    if (!tab.url || !canModifyUrl(tab.url)) continue;
    
    const tabUrlKey = normalizeUrl(tab.url);
    
    // Update exact matches
    if (tabUrlKey === urlKey) {
      await setTabTitle(tab.id, customName);
    }
    // Update child URLs (subdomain/path inheritance)
    else if (isChildUrl(tabUrlKey, urlKey)) {
      const suffix = getUrlSuffix(tabUrlKey, urlKey);
      const inheritedName = suffix ? `${customName} - ${suffix}` : customName;
      await setTabTitle(tab.id, inheritedName);
    }
  }
}

// Restore all tabs with matching URL
async function restoreAllMatchingTabs(urlKey) {
  const tabs = await chrome.tabs.query({});
  const data = await chrome.storage.local.get(['customNames']);
  const customNames = data.customNames || {};
  
  for (const tab of tabs) {
    if (!tab.url || !canModifyUrl(tab.url)) continue;
    
    const tabUrlKey = normalizeUrl(tab.url);
    
    // Restore exact matches
    if (tabUrlKey === urlKey) {
      await restoreTabTitle(tab.id);
    }
    // Check if child URL needs to be updated based on other parent matches
    else if (isChildUrl(tabUrlKey, urlKey)) {
      // Look for other parent matches
      const parentMatch = findParentUrlMatch(tabUrlKey, customNames);
      if (parentMatch) {
        const { customName } = parentMatch;
        const suffix = getUrlSuffix(tabUrlKey, parentMatch.parentUrl);
        const inheritedName = suffix ? `${customName} - ${suffix}` : customName;
        await setTabTitle(tab.id, inheritedName);
      } else {
        // No other parent match, restore original title
        await restoreTabTitle(tab.id);
      }
    }
  }
}

// Normalize URL for consistent matching
function normalizeUrl(url) {
  try {
    const urlObj = new URL(url);
    let normalized = urlObj.hostname + urlObj.pathname;
    
    // Remove www subdomain
    normalized = normalized.replace(/^www\./, '');
    
    // Remove trailing slash
    normalized = normalized.replace(/\/$/, '');
    
    return normalized;
  } catch (e) {
    return url;
  }
}

// Check if one URL is a child of another
function isChildUrl(childUrl, parentUrl) {
  return childUrl.startsWith(parentUrl + '/');
}

// Get the suffix part of a child URL
function getUrlSuffix(childUrl, parentUrl) {
  if (childUrl === parentUrl) return '';
  
  if (childUrl.startsWith(parentUrl + '/')) {
    let suffix = childUrl.substring(parentUrl.length + 1);
    // Clean up the suffix - remove trailing slashes and query parameters
    suffix = suffix.replace(/\/$/, '').split('?')[0];
    return suffix;
  }
  
  return '';
}

// Find a parent URL match for subdomain/path inheritance
function findParentUrlMatch(url, customNames) {
  let longestMatch = null;
  let longestMatchLength = 0;
  
  for (const [storedUrl, customName] of Object.entries(customNames)) {
    if (isChildUrl(url, storedUrl) && storedUrl.length > longestMatchLength) {
      longestMatch = { parentUrl: storedUrl, customName };
      longestMatchLength = storedUrl.length;
    }
  }
  
  return longestMatch;
}

// Apply custom names to all existing tabs on extension load
chrome.runtime.onInstalled.addListener(async () => {
  console.log('Tab Renamer extension installed/updated');
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (tab.url) {
      await applyStoredCustomTitle(tab);
    }
  }
});

// Apply custom names when browser starts
chrome.runtime.onStartup.addListener(async () => {
  console.log('Tab Renamer extension startup');
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (tab.url) {
      await applyStoredCustomTitle(tab);
    }
  }
});