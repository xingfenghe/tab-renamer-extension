# Tab Renamer Chrome Extension Design

## Overview
A Chrome extension that allows users to assign custom names to tabs based on their URLs. The custom names persist across browser sessions and automatically apply when visiting the same URLs.

## Core Features

### 1. Interactive Tab Naming
- **Trigger**: Click the extension icon in the toolbar
- **UI**: Small popup window with input field and restore button
- **Behavior**:
  - For new URLs: Empty input field for entering custom name
  - For renamed URLs: Pre-populated with current custom name, editable
  - Press Enter to save and apply the custom name
  - Click "Restore" button to revert to original tab title
- **Tab Title Replacement**:
  - Custom names **completely replace** the original tab title
  - No concatenation or combination with original title
  - Short, clean tab titles as specified by the user
- **Example**:
  - User visits `https://github.com/user/repo/issues/1234/long-issue-title-that-makes-tab-unreadable`
  - Original tab shows: "Fix: Implementation of new feature system with multiple components · Issue #1234 · user/repo"
  - User clicks extension, enters "Bug #1234"
  - Tab now shows only: "Bug #1234"
  - The long original title is completely replaced

### 2. Persistent Storage
- **Storage**: Chrome's local storage API
- **Data Structure**: Key-value pairs (URL → Custom Name)
- **Persistence**: Survives browser restarts, profile syncing
- **Example**:
  ```json
  {
    "https://github.com/user/repo": "My Project",
    "https://stackoverflow.com/questions/123": "React Hook Solution"
  }
  ```

### 3. Automatic Tab Renaming
- **Trigger**: Page load/refresh
- **Behavior**: Automatically applies saved custom name
- **Example**:
  - User previously named `https://docs.google.com/document/d/abc123` as "Q4 Report"
  - Every time this URL loads (new tab, refresh, browser restart), tab shows "Q4 Report"

### 4. Duplicate URL Handling
- **Behavior**: All tabs with the same URL get the same custom name
- **Real-time sync**: Renaming one tab updates all tabs with that URL
- **Example**:
  - User has 3 tabs open with `https://mail.google.com`
  - Names one tab "Work Email"
  - All 3 tabs immediately show "Work Email"

### 5. Subdomain/Path Inheritance
- **Pattern Matching**: URLs with additional path segments inherit base name with suffix
- **Format**: `{custom_name} - {additional_path_info}`
- **Examples**:
  - Base: `https://example.com/docs` → "API Docs"
  - Inherits:
    - `https://example.com/docs/authentication` → "API Docs - authentication"
    - `https://example.com/docs/api/v2` → "API Docs - api/v2"
    - `https://example.com/docs/guides/quickstart` → "API Docs - guides/quickstart"

## Technical Architecture

### Components

1. **Manifest (manifest.json)**
   - Permissions: tabs, storage, activeTab
   - Background service worker
   - Browser action (popup)
   - Icons: Use icon.png (1024x1024) - will be resized for different contexts:
     - 16x16: Toolbar icon
     - 48x48: Extensions management page
     - 128x128: Chrome Web Store

2. **Background Script (background.js)**
   - Monitors tab updates
   - Applies custom names from storage
   - Handles subdomain pattern matching

3. **Popup (popup.html/popup.js)**
   - Simple form interface
   - Reads/writes to storage
   - Updates current tab immediately

4. **Content Script** (optional)
   - Could dynamically update document.title
   - Ensures consistency with browser history

### Data Flow

1. **Saving a name**:
   ```
   User Input → Popup → Chrome Storage → Background Script → Update All Matching Tabs
   ```

2. **Loading a page**:
   ```
   Tab Navigation → Background Script → Check Storage → Apply Custom Name
   ```

### Storage Schema

```javascript
{
  "customNames": {
    "https://example.com/page1": "Custom Name 1",
    "https://example.com/page2": "Custom Name 2"
  },
  "settings": {
    "enableSubdomainInheritance": true,
    "enableAutoRename": true
  }
}
```

## UI/UX Considerations

### Popup Design
- **Layout**: Minimal, focused interface
  - **Top**: Input text field
    - Shows current custom name if exists (editable)
    - Empty field for new URLs
    - **Enter key behavior**: Immediately saves and renames the tab
    - Placeholder text: "Enter custom tab name..."
  - **Bottom right**: Restore button
    - Clicking restores tab to original title
    - Removes custom name from storage
    - Button only visible when tab has a custom name
- **Dimensions**: Compact window (approximately 300px wide)
- **No save button needed** - Enter key triggers save action

### Visual Feedback
- Instant tab title update
- Success confirmation (brief message or visual cue)
- Error handling for invalid inputs

## Edge Cases & Considerations

1. **URL Normalization**
   - Strip trailing slashes
   - Handle http/https variations
   - Consider query parameters (ignore or include?)

2. **Performance**
   - Efficient storage queries
   - Debounce rapid tab switches
   - Limit pattern matching complexity

3. **Conflicts**
   - What if user wants different names for same URL in different contexts?
   - How to handle very long custom names?

4. **Privacy**
   - Storage is local only
   - No external API calls
   - Clear data management options

## Quality Considerations

### 1. URL Handling
- **Query Parameters**: Strip or preserve? (e.g., `example.com?id=123` vs `example.com`)
- **Anchors/Fragments**: Ignore hash fragments (e.g., treat `page.html#section1` same as `page.html`)
- **WWW Subdomain**: Normalize `www.example.com` and `example.com`
- **Trailing Slashes**: Normalize URLs by removing trailing slashes
- **Protocol**: Treat HTTP and HTTPS as same URL

### 2. Performance & Limits
- **Storage Limits**: Chrome sync storage has 100KB limit, local storage has 5MB
- **Maximum Name Length**: Set reasonable limit (e.g., 100 characters)
- **Large Number of Tabs**: Optimize for users with 100+ tabs
- **Memory Usage**: Clean up data for URLs not visited in X days

### 3. User Experience
- **Keyboard Shortcuts**: 
  - `Ctrl/Cmd + Shift + R` to quickly rename current tab
  - `Escape` to close popup without saving
- **Visual Indicators**: Icon badge to show renamed tabs count
- **Original Title Access**: Show original title as tooltip on hover
- **Bulk Operations**: Select multiple tabs to rename with same prefix

### 4. Edge Cases
- **Dynamic Titles**: Some sites change titles dynamically (e.g., "(3) Gmail")
- **Special Characters**: Handle emojis and unicode in custom names
- **Incognito Mode**: Decide whether to apply custom names in private browsing
- **PDF/Local Files**: Support for `file://` URLs and PDF viewers

### 5. Data Management
- **Export/Import**: JSON format for backing up all custom names
- **Clear Options**: 
  - Clear all custom names
  - Clear names for specific domain
  - Clear names not used in 30 days
- **Statistics**: Show count of custom names, most renamed domains

### 6. Accessibility
- **Screen Readers**: Proper ARIA labels
- **Keyboard Navigation**: Full keyboard support in popup
- **High Contrast**: Support for dark mode and high contrast themes

## Future Enhancements

1. **Export/Import**: Backup and restore custom names
2. **Sync**: Share names across devices (Chrome sync)
3. **Regex Patterns**: More advanced URL matching
4. **Categories**: Group related tabs with color coding
5. **Search**: Quick search through custom-named tabs
6. **Context Menus**: Right-click to rename without opening popup
7. **Tab Groups Integration**: Auto-group tabs with similar custom names
8. **Smart Suggestions**: AI-powered name suggestions based on page content