// Location testing functions
async function testLocationUpdate() {
    const resultsDiv = document.getElementById('results');
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
    
    if (!latitude || !longitude) {
        resultsDiv.textContent = 'Error: Please enter both latitude and longitude values.';
        return;
    }
    
    resultsDiv.textContent = 'Testing Location Update...';
    
    try {
        const response = await fetch('/mcp/location', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'tools/call',
                params: {
                    name: 'update',
                    arguments: {
                        coords: {
                            latitude: parseFloat(latitude),
                            longitude: parseFloat(longitude)
                        }
                    }
                },
            }),
        });
        
        const data = await response.json();
        resultsDiv.textContent = `Location Update Response (${response.status}):\n${JSON.stringify(data, null, 2)}`;
        showSuccess('Location update test completed successfully!');
    } catch (error) {
        resultsDiv.textContent = `Error: ${error.message}`;
        showError('Location update test failed!');
    }
}

async function testLocationQuery() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.textContent = 'Testing Location Query...';
    
    try {
        const response = await fetch('/mcp/location', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'tools/call',
                params: {
                    name: 'query',
                    arguments: {}
                },
            }),
        });
        
        const data = await response.json();
        resultsDiv.textContent = `Location Query Response (${response.status}):\n${JSON.stringify(data, null, 2)}`;
        showSuccess('Location query test completed successfully!');
    } catch (error) {
        resultsDiv.textContent = `Error: ${error.message}`;
        showError('Location query test failed!');
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
                testLocationUpdate();
                break;
            case '2':
                event.preventDefault();
                testLocationQuery();
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
