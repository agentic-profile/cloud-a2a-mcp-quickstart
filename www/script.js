// API testing functions
async function testHealth() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.textContent = 'Testing health check...';
    
    try {
        const response = await fetch('/status');
        const data = await response.json();
        
        resultsDiv.textContent = `Health Check Response (${response.status}):\n${JSON.stringify(data, null, 2)}`;
    } catch (error) {
        resultsDiv.textContent = `Error: ${error.message}`;
    }
}

async function testInitialize() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.textContent = 'Testing MCP initialize...';
    
    try {
        const response = await fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'initialize',
            }),
        });
        
        const data = await response.json();
        resultsDiv.textContent = `MCP Initialize Response (${response.status}):\n${JSON.stringify(data, null, 2)}`;
    } catch (error) {
        resultsDiv.textContent = `Error: ${error.message}`;
    }
}

async function testHireMe() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.textContent = 'Testing HireMe A2A endpoint...';
    
    try {
        const response = await fetch('/a2a/hireme', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: 'test-task-1',
                method: 'tasks/send',
                params: {
                    position: 'Senior Software Engineer',
                    experience: '5+ years',
                },
                userId: 'test-user-123',
                includeAllUpdates: true,
            }),
        });
        
        const data = await response.json();
        resultsDiv.textContent = `HireMe A2A Response (${response.status}):\n${JSON.stringify(data, null, 2)}`;
    } catch (error) {
        resultsDiv.textContent = `Error: ${error.message}`;
    }
}

// Add loading states to buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Add loading state
            const originalText = this.textContent;
            this.textContent = 'Testing...';
            this.disabled = true;
            
            // Reset after a delay (will be overridden by the actual function)
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 5000);
        });
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) {
        switch(event.key) {
            case '1':
                event.preventDefault();
                testHealth();
                break;
            case '2':
                event.preventDefault();
                testInitialize();
                break;
            case '3':
                event.preventDefault();
                testHireMe();
                break;
        }
    }
});

// Add some visual feedback for successful API calls
function showSuccess(message) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.style.borderColor = '#28a745';
    resultsDiv.style.backgroundColor = '#d4edda';
    
    setTimeout(() => {
        resultsDiv.style.borderColor = '#e9ecef';
        resultsDiv.style.backgroundColor = '#f8f9fa';
    }, 3000);
}

function showError(message) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.style.borderColor = '#dc3545';
    resultsDiv.style.backgroundColor = '#f8d7da';
    
    setTimeout(() => {
        resultsDiv.style.borderColor = '#e9ecef';
        resultsDiv.style.backgroundColor = '#f8f9fa';
    }, 3000);
}
