// Generic chat functionality
let messageCounter = 0;
let currentEndpoint = '';
let debugging = null;

function generateMessageId() {
    // Generate a UUID v4 format message ID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Initialize debugging component
    debugging = new CommonDebugging({
        requestUrlElement: 'requestUrl',
        requestTimeElement: 'requestTime',
        sentRequestElement: 'sentRequest',
        receivedResponseElement: 'receivedResponse',
        responseDurationElement: 'responseDuration'
    });
    
    // Generate debugging HTML
    const debuggingContainer = document.getElementById('debugging-container');
    if (debuggingContainer) {
        debuggingContainer.innerHTML = CommonDebugging.createDebuggingHTML({
            requestLabel: 'Sent A2A Request to:',
            responseLabel: 'A2A Response:'
        });
    }
    
    // Get endpoint and title from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const agentUrl = urlParams.get('agentUrl');
    const title = urlParams.get('title');
    
    console.log('URL Parameters:', { agentUrl, title });
    console.log('Current URL:', window.location.href);
    
    // Update page content based on title parameter
    if (title) {
        try {
            // Update page title
            document.getElementById('pageTitle').textContent = `${title} - Agentic Profile MCP Service`;
            
            // Update header
            document.getElementById('pageHeader').textContent = title;
            
            // Update description
            document.getElementById('pageDescription').textContent = `Test ${title.toLowerCase()} A2A endpoint with chat simulation`;
            
            // Update breadcrumb
            document.getElementById('breadcrumbTitle').textContent = title;
        } catch (error) {
            console.error('Error updating title elements:', error);
        }
    }
    
    if (agentUrl) {
        currentEndpoint = agentUrl;
        console.log('Setting currentEndpoint to:', currentEndpoint);
        try {
            const targetUrlElement = document.getElementById('targetUrl');
            if (targetUrlElement) {
                targetUrlElement.textContent = currentEndpoint;
                console.log('Updated targetUrl element to:', currentEndpoint);
            } else {
                console.error('targetUrl element not found');
            }
            debugging.setEndpoint(currentEndpoint);
        } catch (error) {
            console.error('Error updating targetUrl:', error);
        }
    } else {
        // Default endpoint if none specified
        currentEndpoint = '/a2a/hireme';
        console.log('Using default endpoint:', currentEndpoint);
        try {
            const targetUrlElement = document.getElementById('targetUrl');
            if (targetUrlElement) {
                targetUrlElement.textContent = currentEndpoint;
                console.log('Updated targetUrl element to default:', currentEndpoint);
            } else {
                console.error('targetUrl element not found');
            }
            debugging.setEndpoint(currentEndpoint);
        } catch (error) {
            console.error('Error updating targetUrl with default:', error);
        }
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

function updateFullRequestUrl() {
    try {
        const fullUrl = `${window.location.origin}${currentEndpoint}`;
        console.log('Updating full request URL to:', fullUrl);
        const fullUrlElement = document.getElementById('fullRequestUrl');
        if (fullUrlElement) {
            fullUrlElement.textContent = fullUrl;
            console.log('Successfully updated full request URL');
        } else {
            console.error('fullRequestUrl element not found');
        }
    } catch (error) {
        console.error('Error updating full request URL:', error);
    }
}

function changeEndpoint() {
    const newEndpoint = prompt('Enter new endpoint URL (e.g., /a2a/hireme, /a2a/venture, /a2a/vc):', currentEndpoint);
    
    if (newEndpoint && newEndpoint.trim()) {
        currentEndpoint = newEndpoint.trim();
        document.getElementById('targetUrl').textContent = currentEndpoint;
        debugging.setEndpoint(currentEndpoint);
        
        // Update URL parameter
        const url = new URL(window.location);
        url.searchParams.set('agentUrl', currentEndpoint);
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
        // Start request timing
        debugging.startRequest();
        
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
        debugging.displaySentRequest(a2aRequest);
        
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
            
            // Complete the request with response data
            debugging.completeRequest(data);
            
            // Add response to chat
            const text = resolveResponseMessage(data);
            addMessage('agent', text, 'success');
        } else {
            const errorText = `Error: ${response.status} - ${response.statusText}`;
            debugging.completeRequest(errorText, true);
            addMessage('agent', errorText, 'error');
        }
    } catch (error) {
        removeTypingIndicator();
        debugging.handleError(error);
        addMessage('agent', `Network error: ${error.message}`, 'error');
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
    chatMessages.innerHTML = '';
    messageCounter = 0;
    
    // Clear debugging information
    if (debugging) {
        debugging.clear();
    }
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
