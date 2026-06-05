/**
 * Reusable Chatbot Widget
 * A standalone, framework-agnostic chatbot widget that can be embedded in any web application
 * 
 * Features:
 * - REST API communication
 * - Suggested responses
 * - Typing indicators
 * - Multiple message types (text, rich media, actions)
 * - Theme-agnostic CSS
 * - No external dependencies (Vanilla JavaScript)
 * 
 * Usage:
 * <script src="chatbot-widget.js"></script>
 * <script>
 *   ChatBotWidget.init({
 *     apiEndpoint: '/api/chatbot',
 *     position: 'bottom-right'
 *   });
 * </script>
 */

(function (window) {
    'use strict';

    const ChatBotWidget = {
        config: {
            apiEndpoint: '/api/chatbot',
            position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
            theme: 'light', // light, dark
            title: 'Chat Assistant',
            subtitle: 'How can we help?',
            placeholder: 'Type your message...',
            colors: null // Optional: only set if user wants to override CSS defaults
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
         * Only applies colors if explicitly provided in config (otherwise CSS defaults are used)
         */
        _applyCustomStyles: function () {
            // Only override CSS variables if colors were explicitly provided
            if (!this.config.colors) {
                return;
            }

            const root = this.DOM.widget;
            const colors = this.config.colors;

            if (colors.primary) root.style.setProperty('--chatbot-primary-color', colors.primary);
            if (colors.secondary) root.style.setProperty('--chatbot-secondary-color', colors.secondary);
            if (colors.background) root.style.setProperty('--chatbot-background', colors.background);
            if (colors.text) root.style.setProperty('--chatbot-text-color', colors.text);
            if (colors.botMessage) root.style.setProperty('--chatbot-bot-message-bg', colors.botMessage);
            if (colors.userMessage) root.style.setProperty('--chatbot-user-message-bg', colors.userMessage);
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
