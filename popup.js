let currentTab = null;

document.addEventListener('DOMContentLoaded', async () => {
  const nameInput = document.getElementById('nameInput');
  const restoreButton = document.getElementById('restoreButton');
  const statusDiv = document.getElementById('status');
  
  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tab;
  
  // Check if this URL can be modified
  if (!canModifyUrl(tab.url)) {
    nameInput.disabled = true;
    nameInput.placeholder = "Cannot modify protected URLs (chrome://, etc.)";
    restoreButton.style.display = 'none';
    showStatus('Protected URL - cannot be renamed', 'error');
    return;
  }
  
  // Get custom name for current URL
  const urlKey = normalizeUrl(tab.url);
  const data = await chrome.storage.local.get(['customNames']);
  const customNames = data.customNames || {};
  
  if (customNames[urlKey]) {
    nameInput.value = customNames[urlKey];
    restoreButton.classList.remove('hidden');
  }
  
  // Handle Enter key
  nameInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
      await saveCustomName();
    }
  });
  
  // Handle Escape key
  nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.close();
    }
  });
  
  // Handle restore button
  restoreButton.addEventListener('click', async () => {
    await restoreOriginalName();
  });
});

async function saveCustomName() {
  const nameInput = document.getElementById('nameInput');
  const restoreButton = document.getElementById('restoreButton');
  const customName = nameInput.value.trim();
  
  if (!customName) {
    showStatus('Please enter a name', 'error');
    return;
  }
  
  const urlKey = normalizeUrl(currentTab.url);
  
  // Get existing data
  const data = await chrome.storage.local.get(['customNames']);
  const customNames = data.customNames || {};
  
  // Save custom name
  customNames[urlKey] = customName;
  
  await chrome.storage.local.set({ 
    customNames: customNames
  });
  
  // Show restore button
  restoreButton.classList.remove('hidden');
  
  // Show success message
  showStatus('Tab renamed successfully!', 'success');
  
  // Send message to background script to update tabs
  chrome.runtime.sendMessage({
    action: 'setTitle',
    tabId: currentTab.id,
    url: urlKey,
    title: customName
  });
}

async function restoreOriginalName() {
  const urlKey = normalizeUrl(currentTab.url);
  
  // Get existing data
  const data = await chrome.storage.local.get(['customNames']);
  const customNames = data.customNames || {};
  
  // Remove custom name
  delete customNames[urlKey];
  
  await chrome.storage.local.set({ 
    customNames: customNames
  });
  
  // Clear input and hide restore button
  document.getElementById('nameInput').value = '';
  document.getElementById('restoreButton').classList.add('hidden');
  
  // Show success message
  showStatus('Restored to original title!', 'success');
  
  // Send message to background script to restore tabs
  chrome.runtime.sendMessage({
    action: 'restoreTitle',
    tabId: currentTab.id,
    url: urlKey
  });
}

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

function showStatus(message, type = 'success') {
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  statusDiv.classList.add('show');
  
  setTimeout(() => {
    statusDiv.classList.remove('show');
  }, 3000);
}