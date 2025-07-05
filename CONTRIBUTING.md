# Contributing to Tab Renamer Extension

Thank you for your interest in contributing to Tab Renamer! We welcome contributions from the community.

## Development Setup

### Prerequisites
- Google Chrome or Chromium-based browser
- Basic knowledge of JavaScript and Chrome Extension APIs
- Git for version control

### Getting Started
1. **Fork** this repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/yourusername/tab-renamer-extension.git
   cd tab-renamer-extension
   ```

3. **Load the extension** in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)
   - Click "Load unpacked"
   - Select the project directory

4. **Make your changes** and test thoroughly

### Project Structure
```
tab-renamer/
├── manifest.json          # Extension configuration
├── background.js          # Background service worker
├── popup.html            # Extension popup interface  
├── popup.js              # Popup functionality
├── icon.png              # Extension icon (1024x1024)
├── design.md             # Technical design document
├── README.md             # Project documentation
└── CONTRIBUTING.md       # This file
```

## Types of Contributions

### 🐛 Bug Reports
- Use GitHub Issues with the "bug" label
- Include Chrome version, extension version, and steps to reproduce
- Provide console error messages if available
- Test in incognito mode to rule out conflicts

### ✨ Feature Requests  
- Use GitHub Issues with the "enhancement" label
- Describe the use case and expected behavior
- Consider if the feature aligns with the extension's scope
- Check existing issues to avoid duplicates

### 🔧 Code Contributions
- Fork the repository and create a feature branch
- Follow existing code style and patterns
- Test thoroughly across different websites
- Update documentation if needed
- Submit a pull request with clear description

## Development Guidelines

### Code Style
- Use consistent indentation (2 spaces)
- Add comments for complex logic
- Use descriptive variable and function names
- Follow async/await patterns for Chrome APIs

### Testing Checklist
Before submitting a PR, test:
- [ ] Basic tab renaming functionality
- [ ] Persistence across page reloads
- [ ] Multiple tabs with same URL
- [ ] Subdomain inheritance feature
- [ ] Protected URL handling (chrome:// pages)
- [ ] Restore functionality
- [ ] Error states and edge cases

### Manifest V3 Compliance
- Use `chrome.scripting.executeScript()` for content injection
- Avoid deprecated APIs
- Follow security best practices
- Test service worker persistence

## Submission Process

### Pull Request Guidelines
1. **Create descriptive title**: "Add feature X" or "Fix bug Y"
2. **Provide context**: Explain what changes and why
3. **Reference issues**: Link to related GitHub issues
4. **Include screenshots**: For UI changes
5. **Test instructions**: How to verify the changes work

### Review Process
- Maintainers will review within 1-2 weeks
- Feedback will be provided for improvements
- Changes may be requested before merging
- All checks must pass (linting, testing)

## Chrome Web Store Considerations

When contributing, keep in mind:
- Extension must comply with Chrome Web Store policies
- Broad permissions require clear justification
- Privacy policy may need updates for new features
- Store review process can take 1-2 weeks

## Getting Help

### Resources
- [Chrome Extension Developer Guide](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/migrating/)
- [Extension APIs Reference](https://developer.chrome.com/docs/extensions/reference/)

### Communication
- GitHub Issues for bugs and features
- GitHub Discussions for general questions
- Pull Request comments for code review

## Code of Conduct

### Our Standards
- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain a welcoming environment

### Enforcement
- Violations will be addressed promptly
- Repeated offenses may result in bans
- Report issues to project maintainers

## Recognition

Contributors will be:
- Listed in the project README
- Mentioned in release notes
- Credited in Chrome Web Store description

Thank you for helping make Tab Renamer better! 🚀