# Quick Reference - Chatbot Widget Complete

## One-Line Integration

```html
<script src="/Scripts/Chat/chatbot-widget-complete.js"></script>
<script>ChatBotWidget.init({apiEndpoint: '/api/chatbot'});</script>
```

## Configuration Options

```javascript
{
  apiEndpoint: '/api/chatbot',      // Required - your API endpoint
  position: 'bottom-right',          // Optional - 'bottom-right'|'bottom-left'|'top-right'|'top-left'
  theme: 'light',                    // Optional - 'light'|'dark'
  title: 'Chat Assistant',           // Optional - widget title
  subtitle: 'How can we help?',      // Optional - widget subtitle
  placeholder: 'Type...',            // Optional - input placeholder
  colors: {                          // Optional - custom colors
	primary: '#007bff',
	secondary: '#6c757d',
	background: '#ffffff',
	text: '#333333',
	botMessage: '#f0f0f0',
	userMessage: '#007bff'
  }
}
```

## Methods

| Method | Description |
|--------|-------------|
| `ChatBotWidget.open()` | Open the widget |
| `ChatBotWidget.close()` | Close the widget |
| `ChatBotWidget.toggle()` | Toggle open/closed |
| `ChatBotWidget.clearMessages()` | Clear all messages |
| `ChatBotWidget.destroy()` | Remove widget from DOM |
| `ChatBotWidget.init({...})` | Initialize/reinitialize |

## API Endpoints

### Send Message
```
POST /api/chatbot/send
{ "content": "...", "messageType": "text", "sender": "user" }
```

### Get Suggestions
```
GET /api/chatbot/suggestions
```

### Handle Action
```
POST /api/chatbot/action
{ "payload": "..." }
```

## Common Scenarios

### Change Theme Dynamically
```javascript
ChatBotWidget.destroy();
ChatBotWidget.init({
  apiEndpoint: '/api/chatbot',
  theme: 'dark'  // Changed from 'light'
});
```

### Move Widget Position
```javascript
ChatBotWidget.destroy();
ChatBotWidget.init({
  apiEndpoint: '/api/chatbot',
  position: 'bottom-left'  // Changed position
});
ChatBotWidget.open();
```

### Brand Customization
```javascript
ChatBotWidget.init({
  apiEndpoint: '/api/chatbot',
  title: 'My Company Support',
  colors: {
	primary: '#FF6B35',
	secondary: '#004E89'
  }
});
```

### In ASP.NET WebForms Master Page
```html
<script src="<%= ResolveUrl("~/Scripts/Chat/chatbot-widget-complete.js") %>"></script>
<script>
  ChatBotWidget.init({
	apiEndpoint: '/api/chatbot',
	title: '<%: ConfigurationManager.AppSettings["ChatBotTitle"] %>'
  });
</script>
```

### In ASP.NET Core Layout
```html
<script src="~/js/chat/chatbot-widget-complete.js"></script>
<script>
  ChatBotWidget.init({
	apiEndpoint: '@Url.Action("Chat", "Api")'
  });
</script>
```

## Expected Response Format

### Message Response
```json
{
  "content": "Bot response text",
  "messageType": "text",
  "sender": "bot",
  "suggestedResponses": [
	{
	  "text": "Button Text",
	  "payload": "unique_payload",
	  "actionType": "button"
	}
  ]
}
```

### Welcome Response
```json
{
  "content": "Welcome to chat!",
  "suggestedResponses": [...]
}
```

## CSS Classes (For Custom Styling)

```css
.chatbot-widget           /* Main container */
.chatbot-window          /* Chat window */
.chatbot-header          /* Header area */
.chatbot-messages        /* Messages container */
.chatbot-input           /* Input field */
.chatbot-send-btn        /* Send button */
.message-bot             /* Bot message */
.message-user            /* User message */
.message-error           /* Error message */
.chatbot-toggle-btn      /* Toggle button */
```

## CSS Variables (For Theming)

```css
:root {
  --chatbot-primary-color: #007bff;
  --chatbot-secondary-color: #6c757d;
  --chatbot-background: #ffffff;
  --chatbot-text-color: #333333;
  --chatbot-bot-message-bg: #f0f0f0;
  --chatbot-user-message-bg: #007bff;
  --chatbot-border-color: #ddd;
  --chatbot-animation-duration: 0.3s;
}
```

## Best Practices

1. **Initialize once** - Call `init()` once per page load, not on every action
2. **Handle errors** - Implement proper error handling in your API endpoints
3. **Mobile first** - Widget automatically adapts to mobile (full screen)
4. **API security** - Validate all requests on the backend
5. **MSDN ready** - Widget works with all ASP.NET versions
6. **No polling** - Widget polls API only when needed (on init, after messages)

## Troubleshooting Checklist

- ✓ Script loaded successfully (check Network tab)
- ✓ No JavaScript errors (check Console tab)
- ✓ API endpoint is correct and accessible
- ✓ CORS enabled if API on different domain
- ✓ API returns correct JSON format
- ✓ CSS not conflicting with custom styles

## File Locations

```
WebApplicationNetFrameWork/
└── Scripts/
	└── Chat/
		├── chatbot-widget-complete.js      ← Main file to use
		├── chatbot-widget-usage.html       ← Demo & examples
		├── MERGED_VERSION_README.md        ← Full documentation
		├── QUICK_REFERENCE.md              ← This file
		├── chatbot-demo.html               ← Original demo
		├── js/
		│   └── chatbot-widget.js           ← Original JS
		└── css/
			└── chatbot-widget.css          ← Original CSS
```

---

**Need full docs?** See `MERGED_VERSION_README.md`  
**Want examples?** Open `chatbot-widget-usage.html` in a browser
