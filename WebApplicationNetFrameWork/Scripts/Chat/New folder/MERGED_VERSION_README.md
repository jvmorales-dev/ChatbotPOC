# Chatbot Widget - Complete Merged Version

## Overview

This directory contains a reusable, framework-agnostic chatbot widget that has been consolidated into a single JavaScript file for easier distribution and integration.

## Files

### New Merged File
- **`chatbot-widget-complete.js`** - Single file containing:
  - All HTML structure (generated dynamically)
  - All CSS styles (injected as a style tag)
  - All JavaScript functionality
  - **No external dependencies** - Vanilla JavaScript only

### Documentation & Examples
- **`chatbot-widget-usage.html`** - Complete demo and integration guide
- **`README.md`** - This file

### Original Files (For Reference)
- `chatbot-demo.html` - Original demo page
- `js/chatbot-widget.js` - Original JavaScript file
- `css/chatbot-widget.css` - Original CSS file

## Quick Start

### Basic Integration (ASP.NET WebForms)

Add this to your master page (`.Master`) before the closing `</body>` tag:

```html
<!-- Single script tag - that's it! -->
<script src="<%= ResolveUrl("~/Scripts/Chat/chatbot-widget-complete.js") %>"></script>
<script>
  ChatBotWidget.init({
	apiEndpoint: '/api/chatbot'
  });
</script>
```

### Advanced Configuration

```javascript
ChatBotWidget.init({
  apiEndpoint: '/api/chatbot',         // Your API endpoint
  position: 'bottom-right',             // Position: bottom-right, bottom-left, top-right, top-left
  theme: 'light',                       // Theme: light or dark
  title: 'Chat Assistant',              // Widget title
  subtitle: 'How can we help?',         // Widget subtitle  
  placeholder: 'Type your message...', // Input placeholder
  colors: {                             // Customize colors
	primary: '#007bff',
	secondary: '#6c757d',
	background: '#ffffff',
	text: '#333333',
	botMessage: '#f0f0f0',
	userMessage: '#007bff'
  }
});
```

## Public Methods

```javascript
// Control the widget
ChatBotWidget.open();           // Open the widget
ChatBotWidget.close();          // Close the widget
ChatBotWidget.toggle();         // Toggle open/closed

// Manage messages
ChatBotWidget.clearMessages();  // Clear all messages

// Lifecycle
ChatBotWidget.destroy();        // Remove the widget from DOM
ChatBotWidget.init({ ... });    // Re-initialize with new config
```

## Required API Endpoints

Your backend should implement these endpoints:

### POST /api/chatbot/send
Send a message and receive a response.

**Request:**
```json
{
  "content": "Hello, how are you?",
  "messageType": "text",
  "sender": "user"
}
```

**Response:**
```json
{
  "content": "Hello! I'm here to help.",
  "messageType": "text",
  "sender": "bot",
  "suggestedResponses": [
	{
	  "text": "View Appointments",
	  "payload": "view_appointments",
	  "actionType": "button"
	}
  ]
}
```

### GET /api/chatbot/suggestions
Get initial suggested responses.

**Response:**
```json
{
  "content": "What can I help you with?",
  "suggestedResponses": [...]
}
```

### POST /api/chatbot/action
Handle action-based responses.

**Request:**
```json
{ "payload": "view_appointments" }
```

**Response:**
```json
{
  "content": "Loading your appointments...",
  "suggestedResponses": [...],
  "metadata": {
	"action": "redirect",
	"target": "/appointments"
  }
}
```

## Framework Integration Examples

### ASP.NET WebForms
```html
<!-- Site.Master -->
<script src="<%= ResolveUrl("~/Scripts/Chat/chatbot-widget-complete.js") %>"></script>
<script>
  ChatBotWidget.init({ apiEndpoint: '/api/chatbot' });
</script>
```

### ASP.NET MVC
```html
<!-- _Layout.cshtml -->
<script src="~/Scripts/Chat/chatbot-widget-complete.js"></script>
<script>
  ChatBotWidget.init({ 
	apiEndpoint: '@Url.Action("Index", "ChatBot")' 
  });
</script>
```

### ASP.NET Core
```html
<!-- _Layout.cshtml -->
<script src="~/js/chat/chatbot-widget-complete.js"></script>
<script>
  ChatBotWidget.init({ 
	apiEndpoint: '/api/chatbot' 
  });
</script>
```

### Vanilla HTML
```html
<script src="/path/to/chatbot-widget-complete.js"></script>
<script>
  ChatBotWidget.init({ apiEndpoint: '/api/chatbot' });
</script>
```

## Features

✨ **Key Highlights:**

- 📦 **Single File Distribution** - HTML, CSS, and JavaScript merged
- 💬 **REST API Communication** - Framework-agnostic backend integration
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Customizable Theme** - CSS custom properties for easy styling
- ⚡ **No Dependencies** - 100% Vanilla JavaScript
- 💡 **Smart Suggestions** - Display suggested responses
- ⌨️ **Keyboard Support** - Full keyboard navigation
- ♿ **Accessible** - ARIA labels and focus management
- 🌐 **Internationalization Ready** - Easy to translate text
- 📴 **Offline Ready** - Graceful error handling

## Customization

### Custom Colors

```javascript
ChatBotWidget.init({
  apiEndpoint: '/api/chatbot',
  colors: {
	primary: '#667eea',        // Brand color
	secondary: '#764ba2',      // Accent color
	background: '#ffffff',     // Widget background
	text: '#333333',          // Text color
	botMessage: '#f0f0f0',    // Bot message background
	userMessage: '#667eea'    // User message background
  }
});
```

### Custom Text

```javascript
ChatBotWidget.init({
  apiEndpoint: '/api/chatbot',
  title: 'My Custom Title',
  subtitle: 'My Custom Subtitle',
  placeholder: 'Ask me anything...'
});
```

### Position Variants

Available positions for the widget:
- `bottom-right` (default)
- `bottom-left`
- `top-right`
- `top-left`

On mobile devices, the widget automatically expands to full screen.

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## File Size

- **chatbot-widget-complete.js**: ~30 KB (minified: ~12 KB)
- **No external dependencies** - All CSS and HTML included

## Migration Guide

### From Separate Files

**Old way (3 files):**
```html
<link rel="stylesheet" href="/Scripts/Chat/css/chatbot-widget.css">
<script src="/Scripts/Chat/js/chatbot-widget.js"></script>
<script>
  ChatBotWidget.init({ ... });
</script>
```

**New way (1 file):**
```html
<script src="/Scripts/Chat/chatbot-widget-complete.js"></script>
<script>
  ChatBotWidget.init({ ... });
</script>
```

**No code changes needed!** The API remains identical.

## Troubleshooting

### Widget not appearing?
1. Check that the API endpoint is correct
2. Ensure JavaScript errors aren't thrown (check browser console)
3. Verify the script is loaded before calling `init()`

### Messages not sending?
1. Check that your API endpoint is responding
2. Verify CORS settings if on a different domain
3. Check network tab in browser DevTools

### Styling issues?
1. Verify no CSS conflicts with your page
2. Check for CSS specificity issues
3. Use browser DevTools to inspect elements

## Support

For issues or questions, refer to:
- **`chatbot-widget-usage.html`** - Full integration examples
- Browser Developer Console - Check for JavaScript errors
- Network Tab - Verify API calls

## License

This component is part of the Family Portal application.

## Version History

### v2.0.0 (Current)
- ✨ Merged HTML, CSS, and JavaScript into single file
- ✨ Improved distribution and integration
- ✨ Same API, easier deployment

### v1.0.0
- Original separate file structure
- Fully functional widget
- Framework-agnostic design

## Benefits of Merged Version

| Feature | Before | After |
|---------|--------|-------|
| Files to include | 2 (CSS + JS) | 1 (JS) |
| Network requests | 2+ | 1 |
| Setup complexity | Manage paths | Single script |
| Maintenance | Sync multiple files | Single file |
| Distribution | 3 files | 1 file |
| File size | Same | Same |

---

**Questions?** Check `chatbot-widget-usage.html` for comprehensive examples and documentation.
