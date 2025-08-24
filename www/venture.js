// Venture chat functionality
let messageCounter = 0;

document.addEventListener('DOMContentLoaded', function() {
    // Add enter key support for textarea
    const messageTextarea = document.getElementById('messageInput');
    messageTextarea.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && event.ctrlKey) {
            event.preventDefault();
            sendMessage();
        }
    });
});

function sendMessage() {
    const messageText = document.getElementById('messageInput').value.trim();
    
    if (!messageText) {
        addMessage('user', 'Please enter a message.', 'error');
        return;
    }
    
    // Add user message to chat
    addMessage('user', messageText, 'success');
    
    // Clear input field
    document.getElementById('messageInput').value = '';
    
    // Send message to venture endpoint
    callVentureEndpoint(messageText);
}

async function callVentureEndpoint(message) {
    try {
        // Show typing indicator
        addTypingIndicator();
        
        const response = await fetch('/a2a/venture', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: `venture-${Date.now()}`,
                method: 'message/send',
                params: {
                    message: message
                },
                userId: 'test-user-venture',
                includeAllUpdates: true,
            }),
        });
        
        // Remove typing indicator
        removeTypingIndicator();
        
        if (response.ok) {
            const data = await response.json();
            addMessage('venture', `Venture endpoint response:\n${JSON.stringify(data, null, 2)}`, 'success');
        } else {
            addMessage('venture', `Error: ${response.status} - ${response.statusText}`, 'error');
        }
    } catch (error) {
        removeTypingIndicator();
        addMessage('venture', `Network error: ${error.message}`, 'error');
    }
}

function addMessage(sender, content, type = 'info') {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender} ${type}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.innerHTML = content.replace(/\n/g, '<br>');
    
    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    messageTime.textContent = getCurrentTime();
    
    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(messageTime);
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    messageCounter++;
}

function addTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message venture typing';
    typingDiv.id = 'typingIndicator';
    
    const typingContent = document.createElement('div');
    typingContent.className = 'message-content';
    typingContent.innerHTML = '<em>Venture endpoint is processing...</em>';
    
    const typingTime = document.createElement('div');
    typingTime.className = 'message-time';
    typingTime.textContent = getCurrentTime();
    
    typingDiv.appendChild(typingContent);
    typingDiv.appendChild(typingTime);
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function clearChat() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = `
        <div class="message system">
            <div class="message-content">
                <strong>System:</strong> Chat cleared. Send a new message to test the A2A venture endpoint.
            </div>
            <div class="message-time">Just now</div>
        </div>
    `;
    messageCounter = 0;
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) {
        switch(event.key) {
            case 'Enter':
                event.preventDefault();
                sendMessage();
                break;
            case 'k':
                event.preventDefault();
                clearChat();
                break;
        }
    }
});
