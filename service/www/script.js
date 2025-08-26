// API testing functions
async function testHealth() {
    const healthResultsDiv = document.getElementById('healthResults');
    healthResultsDiv.textContent = 'Testing health check...';
    
    try {
        const response = await fetch('/status');
        const data = await response.json();
        
        healthResultsDiv.textContent = `Health Check Response (${response.status}):\n${JSON.stringify(data, null, 2)}`;
    } catch (error) {
        healthResultsDiv.textContent = `Error: ${error.message}`;
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

async function testBusinessAdd() {
    const resultsDiv = document.getElementById('results');
    const businessName = document.getElementById('businessName').value;
    const businessDescription = document.getElementById('businessDescription').value;
    const businessCategory = document.getElementById('businessCategory').value;
    const businessLatitude = document.getElementById('businessLatitude').value;
    const businessLongitude = document.getElementById('businessLongitude').value;
    const businessAddress = document.getElementById('businessAddress').value;
    
    if (!businessName || !businessDescription || !businessCategory || !businessLatitude || !businessLongitude || !businessAddress) {
        resultsDiv.textContent = 'Error: Please fill in all business fields.';
        return;
    }
    
    resultsDiv.textContent = 'Testing Business Add...';
    
    try {
        const response = await fetch('/mcp/match', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'tools/call',
                params: {
                    name: 'add',
                    arguments: {
                        business: {
                            name: businessName,
                            description: businessDescription,
                            category: businessCategory,
                            location: {
                                latitude: parseFloat(businessLatitude),
                                longitude: parseFloat(businessLongitude),
                                address: businessAddress
                            }
                        }
                    }
                },
            }),
        });
        
        const data = await response.json();
        resultsDiv.textContent = `Business Add Response (${response.status}):\n${JSON.stringify(data, null, 2)}`;
        showSuccess('Business add test completed successfully!');
    } catch (error) {
        resultsDiv.textContent = `Error: ${error.message}`;
        showError('Business add test failed!');
    }
}

async function testBusinessFind() {
    const resultsDiv = document.getElementById('results');
    const businessCategory = document.getElementById('businessCategory').value;
    const businessLatitude = document.getElementById('businessLatitude').value;
    const businessLongitude = document.getElementById('businessLongitude').value;
    
    resultsDiv.textContent = 'Testing Business Find...';
    
    try {
        const response = await fetch('/mcp/match', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'tools/call',
                params: {
                    name: 'find',
                    arguments: {
                        criteria: {
                            category: businessCategory,
                            location: {
                                latitude: parseFloat(businessLatitude),
                                longitude: parseFloat(businessLongitude),
                                radius: 10 // 10km radius
                            }
                        }
                    }
                },
            }),
        });
        
        const data = await response.json();
        resultsDiv.textContent = `Business Find Response (${response.status}):\n${JSON.stringify(data, null, 2)}`;
        showSuccess('Business find test completed successfully!');
    } catch (error) {
        resultsDiv.textContent = `Error: ${error.message}`;
        showError('Business find test failed!');
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
            case '4':
                event.preventDefault();
                testLocationUpdate();
                break;
            case '5':
                event.preventDefault();
                testLocationQuery();
                break;
            case '6':
                event.preventDefault();
                testBusinessAdd();
                break;
            case '7':
                event.preventDefault();
                testBusinessFind();
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
