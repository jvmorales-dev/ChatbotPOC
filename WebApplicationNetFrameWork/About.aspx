<%@ Page Title="About" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="About.aspx.cs" Inherits="WebApplicationNetFrameWork.About" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <main aria-labelledby="title">
        <h2 id="title"><%: Title %>.</h2>
        <h3>Your application description page.</h3>
        <p>Use this area to provide additional information.</p>
    </main>

    <!-- Floating Chat Window (iframe-based) -->
    <style>
        /* Toggle button - matches widget style */
        .chat-toggle-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: #007bff;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            z-index: 9998;
        }

        .chat-toggle-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .chat-toggle-btn.hidden {
            opacity: 0;
            pointer-events: none;
        }

        /* Floating iframe container - matches widget window style */
        .chat-iframe-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 380px;
            height: 600px;
            border: none;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            overflow: hidden;
            opacity: 0;
            visibility: hidden;
            transform: scale(0.8) translateY(20px);
            transition: all 0.3s ease-out;
            display: flex;
            flex-direction: column;
            background-color: #ffffff;
        }

        .chat-iframe-container.open {
            opacity: 1;
            visibility: visible;
            transform: scale(1) translateY(0);
        }

        /* Header to match widget */
        .chat-iframe-header {
            background: linear-gradient(135deg, #007bff, #6c757d);
            color: white;
            padding: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .chat-iframe-header h2 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
        }

        .chat-iframe-header p {
            margin: 4px 0 0 0;
            font-size: 12px;
            opacity: 0.9;
        }

        .chat-close-btn {
            background: transparent;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 5px 10px;
        }

        .chat-close-btn:hover {
            opacity: 0.8;
        }

        /* iframe fills remaining space */
        .chat-iframe {
            flex: 1;
            width: 100%;
            border: none;
        }

        /* Placeholder content for demo */
        .chat-placeholder {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #666;
            padding: 20px;
            text-align: center;
        }

        .chat-placeholder p {
            color: #999;
            font-size: 14px;
        }
    </style>

    <!-- Toggle Button -->
    <button type="button" class="chat-toggle-btn" id="chatToggleBtn" onclick="toggleChat()">💬</button>

    <!-- Floating Chat Container -->
    <div class="chat-iframe-container" id="chatContainer">
        <!-- Header (part of parent page, not iframe) -->
        <div class="chat-iframe-header">
            <div>
                <h2>Chat Assistant</h2>
                <p>How can we help?</p>
            </div>
            <button type="button" class="chat-close-btn" onclick="toggleChat()">✕</button>
        </div>

        <!-- Chatbot iframe -->
        <iframe class="chat-iframe" src="https://bedrock-chatbot.gioai.sbx03.pgwplay.net/"></iframe>
    </div>

    <script>
        function toggleChat() {
            var container = document.getElementById('chatContainer');
            var toggleBtn = document.getElementById('chatToggleBtn');

            if (container.classList.contains('open')) {
                container.classList.remove('open');
                toggleBtn.classList.remove('hidden');
            } else {
                container.classList.add('open');
                toggleBtn.classList.add('hidden');
            }
        }
    </script>
</asp:Content>
