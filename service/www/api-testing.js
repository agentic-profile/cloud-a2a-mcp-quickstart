// API testing functions
async function testHealth() {
    const healthResultsDiv = document.getElementById('healthResults');
    healthResultsDiv.textContent = 'Testing health check...';
    
    try {
        const response = await fetch('/status');
        const data = await response.json();
        
        healthResultsDiv.textContent = `Health Check Response (${response.status}):\n${JSON.stringify(data, null, 2)}`;
        showSuccess('Health check test completed successfully!');
    } catch (error) {
        healthResultsDiv.textContent = `Error: ${error.message}`;
        showError('Health check test failed!');
    }
}

async function testHireMe() {
    const healthResultsDiv = document.getElementById('healthResults');
    healthResultsDiv.textContent = 'Testing HireMe A2A endpoint...';
    
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
        healthResultsDiv.textContent = `HireMe A2A Response (${response.status}):\n${JSON.stringify(data, null, 2)}`;
        showSuccess('HireMe A2A test completed successfully!');
    } catch (error) {
        healthResultsDiv.textContent = `Error: ${error.message}`;
        showError('HireMe A2A test failed!');
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
                testHireMe();
                break;
        }
    }
});

// Add some visual feedback for successful API calls
function showSuccess(message) {
    const healthResultsDiv = document.getElementById('healthResults');
    healthResultsDiv.style.borderColor = '#28a745';
    healthResultsDiv.style.backgroundColor = '#d4edda';
    
    setTimeout(() => {
        healthResultsDiv.style.borderColor = '#e9ecef';
        healthResultsDiv.style.backgroundColor = '#f8f9fa';
    }, 3000);
}

function showError(message) {
    const healthResultsDiv = document.getElementById('healthResults');
    healthResultsDiv.style.borderColor = '#dc3545';
    healthResultsDiv.style.backgroundColor = '#f8d7da';
    
    setTimeout(() => {
        healthResultsDiv.style.borderColor = '#e9ecef';
        healthResultsDiv.style.backgroundColor = '#f8f9fa';
    }, 3000);
}
