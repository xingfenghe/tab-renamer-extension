# Tab Renamer - Chrome Extension

![Chrome Extension](https://img.shields.io/badge/Chrome%20Extension-Manifest%20V3-blue?logo=googlechrome)
![License](https://img.shields.io/badge/License-MIT-green)
![Version](https://img.shields.io/badge/Version-1.0.0-orange)

A powerful Chrome extension that allows you to rename browser tabs with custom names that persist across sessions. Perfect for organizing your workflow and making tabs more recognizable.

## ✨ Features

- 🏷️ **Custom Tab Names** - Rename any tab with a custom title
- 💾 **Persistent Storage** - Names are saved and automatically restored when you revisit URLs
- 🔄 **Auto-Refresh Support** - Custom names persist even after page reloads
- 👥 **Duplicate Tab Handling** - All tabs with the same URL share the same custom name
- 🌳 **Subdomain Inheritance** - Child URLs automatically inherit parent names with path suffixes
- ⚡ **Real-time Updates** - Changes apply instantly across all matching tabs
- 🛡️ **Protected URL Handling** - Gracefully handles Chrome internal pages
- 🎯 **Simple Interface** - Clean popup with Enter-to-save and restore functionality

## 🎯 Use Cases

- **Development**: Rename localhost tabs like "Local Dev", "API Server", "Database Admin"
- **Research**: Name similar articles "Research 1", "Research 2", etc.
- **Social Media**: "Twitter - Work", "Twitter - Personal"
- **Documentation**: "React Docs", "Vue Guide", "API Reference"
- **Project Management**: "Jira Board", "Confluence Wiki", "GitHub Issues"

## 📸 Screenshots

### Popup Interface
The extension provides a clean, minimal interface:
- Input field at the top for entering custom names
- Restore button (bottom right) to revert to original titles
- Success/error feedback messages

### Example Usage
```
Original: "React – A JavaScript library for building user interfaces"
Custom:   "React Docs"

Original: "GitHub - facebook/react: A declarative, efficient, and flexible..."
Custom:   "React Repo"

Original: "Stack Overflow - Where Developers Learn, Share, & Build Careers"
Custom:   "SO"
```

## 🚀 Installation

### From Chrome Web Store (Coming Soon)
*Extension will be available on the Chrome Web Store soon*

### Manual Installation (Development)
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory
5. The Tab Renamer icon will appear in your toolbar

## 🔧 Usage

### Basic Renaming
1. **Navigate** to any webpage
2. **Click** the Tab Renamer extension icon
3. **Type** your desired tab name
4. **Press Enter** to apply the custom name
5. The tab title changes immediately!

### Restoring Original Titles
1. **Click** the extension icon on a renamed tab
2. **Click** the "Restore" button
3. The original title is restored

### Advanced Features

#### Subdomain/Path Inheritance
If you rename `example.com/docs` to "API Docs", then:
- `example.com/docs/authentication` becomes "API Docs - authentication"
- `example.com/docs/api/v2` becomes "API Docs - api/v2"

#### Multiple Tab Support
- Rename one tab, and all other tabs with the same URL update automatically
- Perfect for managing multiple instances of the same site

## 🛠️ Technical Details

### Architecture
- **Manifest V3** - Uses the latest Chrome extension standards
- **Background Service Worker** - Monitors tab updates for persistence
- **Content Script Injection** - Modifies `document.title` directly
- **Chrome Storage API** - Stores URL-to-name mappings locally

### Permissions
- `tabs` - Read tab information and detect URL changes
- `storage` - Save custom names persistently  
- `scripting` - Inject scripts to modify tab titles
- `<all_urls>` - Access all websites for title modification

### Browser Support
- ✅ Chrome (Manifest V3)
- ✅ Chromium-based browsers (Edge, Brave, etc.)
- ❌ Firefox (different extension system)

### Limitations
- Cannot modify Chrome internal pages (`chrome://`, `chrome-extension://`)
- Requires broad permissions for full functionality
- Some sites may override titles dynamically (handled with monitoring)

## 🔒 Privacy & Security

- **No data collection** - All storage is local to your browser
- **No external API calls** - Extension works completely offline
- **No tracking** - Your browsing habits are not monitored
- **Open source** - Full code transparency

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/tab-renamer-extension.git
cd tab-renamer-extension

# Load the extension in Chrome
# 1. Open chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked" and select this directory
```

### Project Structure
```
tab-renamer/
├── manifest.json          # Extension configuration
├── background.js          # Background service worker
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── icon.png              # Extension icon
├── design.md             # Technical design document
└── README.md             # This file
```

### Making Changes
1. **Fork** this repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes
4. **Test** thoroughly in Chrome
5. **Commit** your changes (`git commit -m 'Add amazing feature'`)
6. **Push** to the branch (`git push origin feature/amazing-feature`)
7. **Open** a Pull Request

### Bug Reports
Please use GitHub Issues to report bugs. Include:
- Chrome version
- Extension version  
- Steps to reproduce
- Expected vs actual behavior
- Console error messages (if any)

## 📝 Changelog

### v1.0.0 (Initial Release)
- ✨ Basic tab renaming functionality
- ✨ Persistent storage across browser sessions
- ✨ Auto-refresh support with title monitoring
- ✨ Duplicate tab handling
- ✨ Subdomain/path inheritance
- ✨ Protected URL detection
- ✨ Clean popup interface with restore functionality

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⭐ Support

If you find this extension helpful:
- ⭐ **Star** this repository
- 🐛 **Report** any bugs you find
- 💡 **Suggest** new features
- 🤝 **Contribute** to the codebase

## 🔗 Links

- [Chrome Web Store](#) *(Coming Soon)*
- [Technical Design Document](design.md)
- [Issues & Bug Reports](https://github.com/yourusername/tab-renamer-extension/issues)
- [Feature Requests](https://github.com/yourusername/tab-renamer-extension/issues/new?template=feature_request.md)

---

**Made with ❤️ for productivity and organization**