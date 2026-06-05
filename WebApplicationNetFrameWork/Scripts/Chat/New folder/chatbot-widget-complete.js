/**
 * Complete Reusable Chatbot Widget
 * Merged HTML + CSS + JavaScript in a single file
 * A standalone, framework-agnostic chatbot widget that can be embedded in any web application
 * 
 * Features:
 * - REST API communication
 * - Suggested responses
 * - Typing indicators
 * - Multiple message types (text, rich media, actions)
 * - Theme-agnostic styling (CSS embedded)
 * - No external dependencies (Vanilla JavaScript)
 * - Complete HTML structure embedded in JavaScript
 * 
 * Usage:
 * <script src="chatbot-widget-complete.js"></script>
 * <script>
 *   ChatBotWidget.init({
 *     apiEndpoint: '/api/chatbot',
 *     position: 'bottom-right'
 *   });
 * </script>
 */

(function (window) {
    'use strict';

    // Inject CSS styles into the document
    function _injectStyles() {
        if (document.getElementById('chatbot-widget-styles')) {
            return; // Styles already injected
        }

        const style = document.createElement('style');
        style.id = 'chatbot-widget-styles';
        style.textContent = `
/**
 * Chatbot Widget Styles
 * Theme-agnostic, responsive CSS for the chatbot widget
 * Uses CSS custom properties for easy theming
 */

:root {
    /* Default theme colors */
    --chatbot-primary-color: #007bff;
    --chatbot-secondary-color: #6c757d;
    --chatbot-background: #ffffff;
    --chatbot-text-color: #333333;
    --chatbot-bot-message-bg: #f0f0f0;
    --chatbot-user-message-bg: #007bff;
    --chatbot-border-color: #ddd;
    --chatbot-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    --chatbot-animation-duration: 0.3s;
}

/* Dark theme */
.chatbot-widget.theme-dark {
    --chatbot-background: #1e1e1e;
    --chatbot-text-color: #e0e0e0;
    --chatbot-bot-message-bg: #2d2d2d;
    --chatbot-border-color: #444;
    --chatbot-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

/* Main widget container */
.chatbot-widget {
    position: fixed;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 14px;
    color: var(--chatbot-text-color);
    z-index: 9999;
    transition: all var(--chatbot-animation-duration) ease-out;
}

/* Position variants */
.chatbot-widget.bottom-right {
    bottom: 20px;
    right: 20px;
}

.chatbot-widget.bottom-left {
    bottom: 20px;
    left: 20px;
}

.chatbot-widget.top-right {
    top: 20px;
    right: 20px;
}

.chatbot-widget.top-left {
    top: 20px;
    left: 20px;
}

/* Toggle button (minimized state) */
.chatbot-toggle-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: var(--chatbot-primary-color);
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    box-shadow: var(--chatbot-shadow);
    transition: all var(--chatbot-animation-duration) ease;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
}

.chatbot-toggle-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.chatbot-toggle-btn:active {
    transform: scale(0.95);
}

/* Hide toggle when widget is open */
.chatbot-widget.open .chatbot-toggle-btn {
    opacity: 0;
    pointer-events: none;
}

/* Widget window */
.chatbot-window {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 380px;
    height: 600px;
    background-color: var(--chatbot-background);
    border-radius: 12px;
    box-shadow: var(--chatbot-shadow);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    opacity: 0;
    visibility: hidden;
    transform: scale(0.8) translateY(20px);
    transition: all var(--chatbot-animation-duration) ease-out;
    z-index: 20;
}

.chatbot-widget.open .chatbot-window {
    opacity: 1;
    visibility: visible;
    transform: scale(1) translateY(0);
}

/* Header */
.chatbot-header {
    background: linear-gradient(135deg, var(--chatbot-primary-color), var(--chatbot-secondary-color));
    color: white;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px solid var(--chatbot-border-color);
}

.chatbot-header-content {
    flex: 1;
}

.chatbot-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.2;
}

.chatbot-subtitle {
    margin: 4px 0 0 0;
    font-size: 12px;
    opacity: 0.9;
    line-height: 1.2;
}

/* Close button */
.chatbot-close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    margin-left: 12px;
    transition: transform var(--chatbot-animation-duration);
}

.chatbot-close-btn:hover {
    transform: rotate(90deg);
}

/* Messages container */
.chatbot-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    background-color: var(--chatbot-background);
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* Scrollbar styling */
.chatbot-messages::-webkit-scrollbar {
    width: 6px;
}

.chatbot-messages::-webkit-scrollbar-track {
    background: transparent;
}

.chatbot-messages::-webkit-scrollbar-thumb {
    background: var(--chatbot-secondary-color);
    border-radius: 3px;
}

.chatbot-messages::-webkit-scrollbar-thumb:hover {
    background: var(--chatbot-primary-color);
}

/* Message styling */
.chatbot-message {
    display: flex;
    animation: slideIn var(--chatbot-animation-duration) ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.message-bot {
    justify-content: flex-start;
}

.message-user {
    justify-content: flex-end;
}

.message-error {
    justify-content: flex-start;
}

.message-content {
    max-width: 80%;
    padding: 10px 14px;
    border-radius: 12px;
    word-wrap: break-word;
    line-height: 1.4;
}

.message-bot .message-content {
    background-color: var(--chatbot-bot-message-bg);
    color: var(--chatbot-text-color);
    border-bottom-left-radius: 4px;
}

.message-user .message-content {
    background-color: var(--chatbot-user-message-bg);
    color: white;
    border-bottom-right-radius: 4px;
}

.message-error .message-content {
    background-color: #f8d7da;
    color: #721c24;
    border-bottom-left-radius: 4px;
}

/* Suggested responses container */
.chatbot-suggestions {
    padding: 12px 16px;
    background-color: var(--chatbot-background);
    border-top: 1px solid var(--chatbot-border-color);
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    min-height: 0;
    max-height: 120px;
    overflow-y: auto;
}

.chatbot-suggestions:empty {
    display: none;
}

/* Suggestion buttons */
.chatbot-suggestion-btn {
    padding: 8px 12px;
    border-radius: 20px;
    border: 1px solid var(--chatbot-primary-color);
    background-color: transparent;
    color: var(--chatbot-primary-color);
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all var(--chatbot-animation-duration);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.chatbot-suggestion-btn:hover {
    background-color: var(--chatbot-primary-color);
    color: white;
    transform: translateY(-2px);
}

.chatbot-suggestion-btn:active {
    transform: translateY(0);
}

.suggestion-button {
    background-color: var(--chatbot-primary-color);
    color: white;
    border-color: var(--chatbot-primary-color);
}

.suggestion-button:hover {
    background-color: var(--chatbot-secondary-color);
    border-color: var(--chatbot-secondary-color);
}

/* Input container */
.chatbot-input-container {
    padding: 12px 16px;
    background-color: var(--chatbot-background);
    border-top: 1px solid var(--chatbot-border-color);
    display: flex;
    gap: 8px;
}

/* Input field */
.chatbot-input {
    flex: 1;
    padding: 10px 12px;
    border: 1px solid var(--chatbot-border-color);
    border-radius: 20px;
    font-size: 14px;
    background-color: var(--chatbot-background);
    color: var(--chatbot-text-color);
    outline: none;
    transition: border-color var(--chatbot-animation-duration);
}

.chatbot-input:focus {
    border-color: var(--chatbot-primary-color);
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

.chatbot-input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Send button */
.chatbot-send-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background-color: var(--chatbot-primary-color);
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: all var(--chatbot-animation-duration);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.chatbot-send-btn:hover:not(:disabled) {
    background-color: var(--chatbot-secondary-color);
    transform: scale(1.05);
}

.chatbot-send-btn:active:not(:disabled) {
    transform: scale(0.95);
}

.chatbot-send-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Typing indicator */
.typing-indicator {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 10px 14px;
    background-color: var(--chatbot-bot-message-bg);
    border-radius: 12px;
    border-bottom-left-radius: 4px;
}

.typing-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--chatbot-secondary-color);
    animation: typingAnimation 1.4s infinite;
}

.typing-dot:nth-child(2) {
    animation-delay: 0.2s;
}

.typing-dot:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes typingAnimation {
    0%, 60%, 100% {
        opacity: 0.5;
        transform: translateY(0);
    }
    30% {
        opacity: 1;
        transform: translateY(-10px);
    }
}

/* Responsive design */
@media (max-width: 480px) {
    .chatbot-widget.bottom-right,
    .chatbot-widget.bottom-left,
    .chatbot-widget.top-right,
    .chatbot-widget.top-left {
        bottom: 0;
        right: 0;
        top: auto;
        left: auto;
    }

    .chatbot-window {
        width: 100%;
        height: 100%;
        max-height: 100vh;
        border-radius: 0;
    }

    .chatbot-toggle-btn {
        width: 50px;
        height: 50px;
        font-size: 20px;
    }

    .message-content {
        max-width: 90%;
    }
}

/* Print styles */
@media print {
    .chatbot-widget {
        display: none;
    }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

/* Focus styles for keyboard navigation */
.chatbot-toggle-btn:focus,
.chatbot-close-btn:focus,
.chatbot-suggestion-btn:focus,
.chatbot-send-btn:focus,
.chatbot-input:focus {
    outline: 2px solid var(--chatbot-primary-color);
    outline-offset: 2px;
}
        `;
        document.head.appendChild(style);
    }

    const ChatBotWidget = {
        config: {
            apiEndpoint: '/api/chatbot',
            position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
            theme: 'light', // light, dark
            title: 'Chat Assistant',
            subtitle: 'How can we help?',
            placeholder: 'Type your message...',
            colors: {
                primary: '#007bff',
                secondary: '#6c757d',
                background: '#ffffff',
                text: '#333333',
                botMessage: '#f0f0f0',
                userMessage: '#007bff'
            }
        },

        state: {
            isOpen: false,
            isLoading: false,
            messages: [],
            messageId: 0
        },

        DOM: {
            widget: null,
            header: null,
            messagesContainer: null,
            inputContainer: null,
            toggleBtn: null,
            closeBtn: null,
            inputField: null,
            sendBtn: null,
            suggestionsContainer: null
        },

        /**
         * Initialize the chatbot widget
         */
        init: function (options) {
            // Inject CSS styles
            _injectStyles();

            // Merge user config with defaults
            this.config = { ...this.config, ...options };

            // Create widget DOM
            this._createWidget();

            // Bind events
            this._bindEvents();

            // Load initial suggestions
            this._loadInitialSuggestions();

            console.log('[ChatBot Widget] Initialized with config:', this.config);
        },

        /**
         * Create the widget DOM structure
         */
        _createWidget: function () {
            // Main widget container
            this.DOM.widget = document.createElement('div');
            this.DOM.widget.className = 'chatbot-widget ' + this.config.position + ' theme-' + this.config.theme;
            this.DOM.widget.id = 'chatbot-widget-container';

            // Toggle button (minimized state)
            this.DOM.toggleBtn = document.createElement('button');
            this.DOM.toggleBtn.className = 'chatbot-toggle-btn';
            this.DOM.toggleBtn.innerHTML = '💬';
            this.DOM.toggleBtn.setAttribute('aria-label', 'Open chat');

            // Widget window
            const widgetWindow = document.createElement('div');
            widgetWindow.className = 'chatbot-window';

            // Header
            this.DOM.header = document.createElement('div');
            this.DOM.header.className = 'chatbot-header';
            this.DOM.header.innerHTML = `
                <div class="chatbot-header-content">
                    <h2 class="chatbot-title">${this.config.title}</h2>
                    <p class="chatbot-subtitle">${this.config.subtitle}</p>
                </div>
                <button class="chatbot-close-btn" aria-label="Close chat">✕</button>
            `;
            this.DOM.closeBtn = this.DOM.header.querySelector('.chatbot-close-btn');

            // Messages container
            this.DOM.messagesContainer = document.createElement('div');
            this.DOM.messagesContainer.className = 'chatbot-messages';

            // Input container
            this.DOM.inputContainer = document.createElement('div');
            this.DOM.inputContainer.className = 'chatbot-input-container';

            this.DOM.inputField = document.createElement('input');
            this.DOM.inputField.type = 'text';
            this.DOM.inputField.className = 'chatbot-input';
            this.DOM.inputField.placeholder = this.config.placeholder;
            this.DOM.inputField.setAttribute('aria-label', 'Message input');

            this.DOM.sendBtn = document.createElement('button');
            this.DOM.sendBtn.className = 'chatbot-send-btn';
            this.DOM.sendBtn.innerHTML = '➤';
            this.DOM.sendBtn.setAttribute('aria-label', 'Send message');

            this.DOM.inputContainer.appendChild(this.DOM.inputField);
            this.DOM.inputContainer.appendChild(this.DOM.sendBtn);

            // Suggestions container
            this.DOM.suggestionsContainer = document.createElement('div');
            this.DOM.suggestionsContainer.className = 'chatbot-suggestions';

            // Assemble widget
            widgetWindow.appendChild(this.DOM.header);
            widgetWindow.appendChild(this.DOM.messagesContainer);
            widgetWindow.appendChild(this.DOM.suggestionsContainer);
            widgetWindow.appendChild(this.DOM.inputContainer);

            this.DOM.widget.appendChild(this.DOM.toggleBtn);
            this.DOM.widget.appendChild(widgetWindow);

            // Add to DOM
            document.body.appendChild(this.DOM.widget);

            // Apply custom styles
            this._applyCustomStyles();
        },

        /**
         * Apply custom CSS variables for theming
         */
        _applyCustomStyles: function () {
            const root = this.DOM.widget;
            root.style.setProperty('--chatbot-primary-color', this.config.colors.primary);
            root.style.setProperty('--chatbot-secondary-color', this.config.colors.secondary);
            root.style.setProperty('--chatbot-background', this.config.colors.background);
            root.style.setProperty('--chatbot-text-color', this.config.colors.text);
            root.style.setProperty('--chatbot-bot-message-bg', this.config.colors.botMessage);
            root.style.setProperty('--chatbot-user-message-bg', this.config.colors.userMessage);
        },

        /**
         * Bind event listeners
         */
        _bindEvents: function () {
            this.DOM.toggleBtn.addEventListener('click', () => this.toggle());
            this.DOM.closeBtn.addEventListener('click', () => this.close());
            this.DOM.sendBtn.addEventListener('click', () => this._sendMessage());
            this.DOM.inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this._sendMessage();
            });
        },

        /**
         * Toggle widget open/closed
         */
        toggle: function () {
            if (this.state.isOpen) {
                this.close();
            } else {
                this.open();
            }
        },

        /**
         * Open the widget
         */
        open: function () {
            this.state.isOpen = true;
            this.DOM.widget.classList.add('open');
            this.DOM.inputField.focus();
        },

        /**
         * Close the widget
         */
        close: function () {
            this.state.isOpen = false;
            this.DOM.widget.classList.remove('open');
        },

        /**
         * Send a message to the chatbot
         */
        _sendMessage: function () {
            const content = this.DOM.inputField.value.trim();

            if (!content) return;

            // Clear input
            this.DOM.inputField.value = '';

            // Create user message
            const userMessage = {
                id: ++this.state.messageId,
                content: content,
                sender: 'user',
                messageType: 'text',
                timestamp: new Date()
            };

            // Add to messages
            this.state.messages.push(userMessage);
            this._renderMessage(userMessage);

            // Disable input while processing
            this.DOM.inputField.disabled = true;
            this.DOM.sendBtn.disabled = true;
            this.state.isLoading = true;

            // Send to API
            this._callAPI('/send', userMessage)
                .then(response => {
                    // Add bot response
                    response.id = ++this.state.messageId;
                    this.state.messages.push(response);

                    // Simulate typing delay
                    setTimeout(() => {
                        this._renderMessage(response);

                        // Render suggested responses if available
                        if (response.suggestedResponses && response.suggestedResponses.length > 0) {
                            this._renderSuggestedResponses(response.suggestedResponses);
                        }

                        // Re-enable input
                        this.DOM.inputField.disabled = false;
                        this.DOM.sendBtn.disabled = false;
                        this.DOM.inputField.focus();
                        this.state.isLoading = false;
                    }, 500);
                })
                .catch(error => {
                    console.error('[ChatBot Widget] Error:', error);
                    this._renderErrorMessage('Sorry, I encountered an error. Please try again.');

                    this.DOM.inputField.disabled = false;
                    this.DOM.sendBtn.disabled = false;
                    this.DOM.inputField.focus();
                    this.state.isLoading = false;
                });
        },

        /**
         * Render a message in the chat window
         */
        _renderMessage: function (message) {
            const messageEl = document.createElement('div');
            messageEl.className = `chatbot-message message-${message.sender}`;
            messageEl.setAttribute('data-message-id', message.id);

            const contentEl = document.createElement('div');
            contentEl.className = 'message-content';

            if (message.messageType === 'text') {
                contentEl.textContent = message.content;
            } else if (message.messageType === 'richMedia') {
                contentEl.innerHTML = message.content;
            } else {
                contentEl.textContent = message.content;
            }

            messageEl.appendChild(contentEl);
            this.DOM.messagesContainer.appendChild(messageEl);

            // Scroll to bottom
            this._scrollToBottom();
        },

        /**
         * Render suggested responses
         */
        _renderSuggestedResponses: function (suggestions) {
            // Clear previous suggestions
            this.DOM.suggestionsContainer.innerHTML = '';

            suggestions.forEach(suggestion => {
                const btn = document.createElement('button');
                btn.className = `chatbot-suggestion-btn suggestion-${suggestion.actionType}`;
                btn.textContent = suggestion.text;
                btn.setAttribute('data-payload', suggestion.payload);

                btn.addEventListener('click', () => {
                    this._handleSuggestionClick(suggestion);
                });

                this.DOM.suggestionsContainer.appendChild(btn);
            });
        },

        /**
         * Handle suggestion button click
         */
        _handleSuggestionClick: function (suggestion) {
            // Add suggestion as user message
            const userMessage = {
                id: ++this.state.messageId,
                content: suggestion.text,
                sender: 'user',
                messageType: 'text',
                timestamp: new Date()
            };

            this.state.messages.push(userMessage);
            this._renderMessage(userMessage);

            // Clear suggestions
            this.DOM.suggestionsContainer.innerHTML = '';

            // Disable input
            this.DOM.inputField.disabled = true;
            this.DOM.sendBtn.disabled = true;
            this.state.isLoading = true;

            // Send action to API
            this._callAPI('/action', { payload: suggestion.payload })
                .then(response => {
                    response.id = ++this.state.messageId;
                    this.state.messages.push(response);

                    setTimeout(() => {
                        this._renderMessage(response);

                        // Render suggested responses if available
                        if (response.suggestedResponses && response.suggestedResponses.length > 0) {
                            this._renderSuggestedResponses(response.suggestedResponses);
                        }

                        // Handle redirects if specified in metadata
                        if (response.metadata && response.metadata.action === 'redirect') {
                            setTimeout(() => {
                                window.location.href = response.metadata.target;
                            }, 1000);
                        }

                        this.DOM.inputField.disabled = false;
                        this.DOM.sendBtn.disabled = false;
                        this.DOM.inputField.focus();
                        this.state.isLoading = false;
                    }, 500);
                })
                .catch(error => {
                    console.error('[ChatBot Widget] Error:', error);
                    this._renderErrorMessage('Sorry, I encountered an error processing your action.');

                    this.DOM.inputField.disabled = false;
                    this.DOM.sendBtn.disabled = false;
                    this.DOM.inputField.focus();
                    this.state.isLoading = false;
                });
        },

        /**
         * Load initial suggestions on widget open
         */
        _loadInitialSuggestions: function () {
            this._callAPI('/suggestions', {}, 'GET')
                .then(response => {
                    if (response.suggestedResponses && response.suggestedResponses.length > 0) {
                        this._renderSuggestedResponses(response.suggestedResponses);
                    }

                    // Add welcome message
                    const welcomeMessage = {
                        id: ++this.state.messageId,
                        content: response.content || 'Welcome! How can I help you?',
                        sender: 'bot',
                        messageType: 'text',
                        timestamp: new Date()
                    };
                    this.state.messages.push(welcomeMessage);
                })
                .catch(error => {
                    console.warn('[ChatBot Widget] Could not load initial suggestions:', error);
                });
        },

        /**
         * Render an error message
         */
        _renderErrorMessage: function (message) {
            const messageEl = document.createElement('div');
            messageEl.className = 'chatbot-message message-error';
            messageEl.setAttribute('data-message-id', ++this.state.messageId);

            const contentEl = document.createElement('div');
            contentEl.className = 'message-content';
            contentEl.textContent = message;

            messageEl.appendChild(contentEl);
            this.DOM.messagesContainer.appendChild(messageEl);

            this._scrollToBottom();
        },

        /**
         * Call the chatbot API
         */
        _callAPI: function (endpoint, data, method = 'POST') {
            const url = this.config.apiEndpoint + endpoint;
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            if (method === 'POST') {
                options.body = JSON.stringify(data);
            } else if (method === 'GET' && Object.keys(data).length > 0) {
                const params = new URLSearchParams(data).toString();
                return fetch(url + '?' + params, options);
            }

            return fetch(url, options)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP Error: ${response.status}`);
                    }
                    return response.json();
                });
        },

        /**
         * Scroll messages to bottom
         */
        _scrollToBottom: function () {
            setTimeout(() => {
                this.DOM.messagesContainer.scrollTop = this.DOM.messagesContainer.scrollHeight;
            }, 0);
        },

        /**
         * Clear all messages
         */
        clearMessages: function () {
            this.state.messages = [];
            this.DOM.messagesContainer.innerHTML = '';
            this.DOM.suggestionsContainer.innerHTML = '';
        },

        /**
         * Destroy the widget
         */
        destroy: function () {
            if (this.DOM.widget) {
                this.DOM.widget.remove();
                this.DOM = {};
                this.state = {};
            }
        }
    };

    // Expose to global scope
    window.ChatBotWidget = ChatBotWidget;

})(window);
