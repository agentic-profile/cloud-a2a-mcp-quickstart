// Generic chat functionality
let messageCounter = 0;
let currentEndpoint = '';

function generateMessageId() {
    // Generate a UUID v4 format message ID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Get endpoint from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const agenturl = urlParams.get('agenturl');
    
    if (agenturl) {
        currentEndpoint = agenturl;
        document.getElementById('targetUrl').textContent = currentEndpoint;
    } else {
        // Default endpoint if none specified
        currentEndpoint = '/a2a/hireme';
        document.getElementById('targetUrl').textContent = currentEndpoint;
    }
    
    // Add enter key support for textarea
    const messageTextarea = document.getElementById('messageInput');
    messageTextarea.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && event.ctrlKey) {
            event.preventDefault();
            sendMessage();
        }
    });
    
    // Focus on message input
    messageTextarea.focus();
});

function changeEndpoint() {
    const newEndpoint = prompt('Enter new endpoint URL (e.g., /a2a/hireme, /a2a/venture, /a2a/vc):', currentEndpoint);
    
    if (newEndpoint && newEndpoint.trim()) {
        currentEndpoint = newEndpoint.trim();
        document.getElementById('targetUrl').textContent = currentEndpoint;
        
        // Update URL parameter
        const url = new URL(window.location);
        url.searchParams.set('agenturl', currentEndpoint);
        window.history.replaceState({}, '', url);
        
        // Add system message about endpoint change
        addMessage('system', `Endpoint changed to: ${currentEndpoint}`, 'info');
    }
}

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
    
    // Send message to configured endpoint
    callA2AEndpoint(messageText);
}

async function callA2AEndpoint(message) {
    try {
        // Show typing indicator
        addTypingIndicator();
        
        // Create the A2A request
        const a2aRequest = {
            jsonrpc: "2.0",
            id: 1,
            method: "message/send",
            params: {
                message: {
                    role: "user",
                    parts: [
                        {
                            kind: "text",
                            text: message
                        }
                    ],
                    messageId: generateMessageId()
                },
                metadata: {}
            }
        };
        
        // Display the sent request
        document.getElementById('sentRequest').textContent = JSON.stringify(a2aRequest, null, 2);
        
        const response = await fetch(currentEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(a2aRequest),
        });
        
        // Remove typing indicator
        removeTypingIndicator();
        
        if (response.ok) {
            const data = await response.json();
            
            // Display the received response
            document.getElementById('receivedResponse').textContent = JSON.stringify(data, null, 4);
            
            // Add response to chat
            const text = resolveResponseMessage(data);
            addMessage('agent', text, 'success');
        } else {
            const errorText = `Error: ${response.status} - ${response.statusText}`;
            document.getElementById('receivedResponse').textContent = errorText;
            addMessage('agent', errorText, 'error');
        }
    } catch (error) {
        removeTypingIndicator();
        const errorText = `Network error: ${error.message}`;
        document.getElementById('receivedResponse').textContent = errorText;
        addMessage('agent', errorText, 'error');
    }
}

function resolveResponseMessage(response) {
    const result = response.result;
    if( result.kind === "message" )
        return result.parts[0].text;
    else
        return JSON.stringify(result, null, 4);
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
    typingDiv.className = 'message agent typing';
    typingDiv.id = 'typingIndicator';
    
    const typingContent = document.createElement('div');
    typingContent.className = 'message-content';
    typingContent.innerHTML = `<em>${currentEndpoint} is processing...</em>`;
    
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
                <strong>System:</strong> Chat cleared. Send a new message to test the A2A endpoint.
            </div>
            <div class="message-time">Just now</div>
        </div>
    `;
    messageCounter = 0;
    
    // Clear request/response display
    document.getElementById('sentRequest').textContent = 'No request sent yet';
    document.getElementById('receivedResponse').textContent = 'No response received yet';
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
            case 'e':
                event.preventDefault();
                changeEndpoint();
                break;
        }
    }
});
