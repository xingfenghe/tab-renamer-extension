# Chrome Web Store Submission Guide

## Single Purpose Statement

**Primary Purpose**: Tab Renamer allows users to assign custom names to browser tabs for better organization and productivity.

**Detailed Description**:
The extension serves one specific function - enabling users to replace long, confusing browser tab titles with short, memorable custom names. This single purpose enhances tab management and workspace organization without adding unrelated features or functionality.

**Why this is narrow and easy-to-understand**:
- ✅ **Specific function**: Only renames tab titles
- ✅ **Clear user benefit**: Better tab organization  
- ✅ **No feature creep**: Doesn't include bookmarking, history, browsing tools, or other unrelated features
- ✅ **Focused scope**: Limited to tab title management only

## Permission Justification

The extension requests the following permissions, each essential for its single purpose:

### Required Permissions

#### 1. `"tabs"` Permission
**Purpose**: Required to read tab information and detect URL changes
**Justification**: 
- Monitor when tabs are created/updated to apply saved custom names
- Access tab.url to match against stored custom names
- Essential for detecting page navigation to reapply custom titles

#### 2. `"storage"` Permission  
**Purpose**: Save custom tab names persistently across browser sessions
**Justification**:
- Store URL-to-custom-name mappings locally
- Ensure custom names persist after browser restarts
- Core functionality requires data persistence

#### 3. `"scripting"` Permission
**Purpose**: Inject JavaScript to modify document.title on web pages
**Justification**:
- Only way to change tab titles in Manifest V3
- Executes `document.title = customName` on target pages
- Required for the primary function of renaming tabs

#### 4. `"<all_urls>"` Host Permission
**Purpose**: Access all websites to modify their tab titles
**Justification**:
- Users expect to rename tabs on any website
- Cannot predict which sites users will want to rename
- Limiting to specific domains would severely restrict functionality
- No sensitive data is accessed - only document.title is modified

### Permissions NOT Requested
- ❌ `activeTab` - Too limited, only works on user interaction
- ❌ `history` - Not needed for tab renaming
- ❌ `bookmarks` - Outside our single purpose
- ❌ `cookies` - Not accessing user data
- ❌ `downloads` - Unrelated functionality

### Alternative Considered
**activeTab Permission**: Would be more privacy-friendly but insufficient because:
- Can only modify the currently active tab
- Cannot automatically apply names when switching between tabs
- Would break the core feature of persistent, automatic tab renaming

## Privacy Policy

### Data Collection Statement
**Tab Renamer does NOT collect any user data.**

### What We Don't Collect
- ❌ **No browsing history** - We don't track what sites you visit
- ❌ **No personal information** - No names, emails, or personal data
- ❌ **No usage analytics** - No tracking of how you use the extension
- ❌ **No external communication** - No data sent to external servers
- ❌ **No cookies or tracking** - No persistent identifiers

### What We Store Locally
- ✅ **URL-to-name mappings only** - Stored locally in your browser
- ✅ **Example**: `{"github.com/user/repo": "My Project"}`
- ✅ **Local storage only** - Data never leaves your device

### Privacy Practices
1. **Local Storage Only**: All data is stored locally using Chrome's storage API
2. **No External Servers**: Extension works completely offline
3. **No Network Requests**: Extension makes no API calls or external connections
4. **User Control**: Users can clear all data by removing custom names or uninstalling
5. **Transparent Functionality**: Open source code available for review

### Compliance
- **GDPR Compliant**: No personal data processing
- **CCPA Compliant**: No personal information collection
- **Children Safe**: No data collection from any users

### Privacy Policy URL
Since no user data is collected, a formal privacy policy may not be required. However, if needed, this information can be hosted at: `https://github.com/xingfenghe/tab-renamer-extension/blob/main/PRIVACY.md`

## Manifest V3 Compliance

### Service Worker Implementation
- ✅ Uses background service worker instead of persistent background page
- ✅ Event-driven architecture with proper lifecycle management
- ✅ No persistent background processing

### Content Security Policy
- ✅ No inline JavaScript in HTML files
- ✅ No `eval()` or similar dynamic code execution
- ✅ All scripts properly referenced in manifest

### API Usage
- ✅ Uses `chrome.scripting.executeScript()` (V3) instead of deprecated `chrome.tabs.executeScript()` (V2)
- ✅ Proper error handling for all Chrome API calls
- ✅ No deprecated APIs used

## Quality Assurance

### Testing Checklist
- ✅ Basic tab renaming functionality
- ✅ Persistence across browser restarts
- ✅ Multiple tabs with same URL handling
- ✅ Protected URL graceful handling (chrome://)
- ✅ Subdomain inheritance feature
- ✅ Restore functionality
- ✅ Error states and edge cases
- ✅ Performance with 50+ tabs

### Browser Compatibility
- ✅ Chrome 88+ (Manifest V3 support)
- ✅ Edge 88+ (Chromium-based)
- ✅ Other Chromium browsers

### Code Quality
- ✅ ESLint compliant
- ✅ No console errors
- ✅ Proper error handling
- ✅ Memory leak prevention
- ✅ Clean uninstall (no data remnants)

## Submission Checklist

### Required Assets
- ✅ Extension package (.zip with all files)
- ✅ Icons: 16x16, 48x48, 128x128 PNG
- ✅ Screenshots: 1280x800 PNG (minimum 1)
- ✅ Detailed description
- ✅ Privacy policy (if applicable)

### Store Listing
- ✅ Clear, descriptive title: "Tab Renamer"
- ✅ Detailed description explaining functionality
- ✅ Professional screenshots showing extension in use
- ✅ Appropriate category: "Productivity"
- ✅ Relevant keywords: tab management, productivity, organization

### Version Information
- **Version**: 1.0.0
- **Manifest Version**: 3
- **Minimum Chrome Version**: 88

This documentation demonstrates that Tab Renamer has a single, clear purpose with properly justified permissions and respects user privacy through local-only data storage.