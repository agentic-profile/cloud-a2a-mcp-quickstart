// Location testing using the Common Form system
let updateDebugging = null;
let queryDebugging = null;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize debugging component for update form
    updateDebugging = new CommonDebugging({
        requestUrlElement: 'updateRequestUrl',
        requestTimeElement: 'updateRequestTime',
        sentRequestElement: 'updateSentRequest',
        receivedResponseElement: 'updateReceivedResponse',
        responseDurationElement: 'updateResponseDuration'
    });
    
    // Initialize debugging component for query form
    queryDebugging = new CommonDebugging({
        requestUrlElement: 'queryRequestUrl',
        requestTimeElement: 'queryRequestTime',
        sentRequestElement: 'querySentRequest',
        receivedResponseElement: 'queryReceivedResponse',
        responseDurationElement: 'queryResponseDuration'
    });
    
    // Generate debugging HTML for update form
    const updateDebuggingContainer = document.getElementById('update-debugging-container');
    if (updateDebuggingContainer) {
        updateDebuggingContainer.innerHTML = CommonDebugging.createDebuggingHTML({
            requestLabel: 'Sent MCP Request to:',
            responseLabel: 'MCP Response:'
        }).replace(/id="requestUrl"/g, 'id="updateRequestUrl"')
           .replace(/id="requestTime"/g, 'id="updateRequestTime"')
           .replace(/id="sentRequest"/g, 'id="updateSentRequest"')
           .replace(/id="receivedResponse"/g, 'id="updateReceivedResponse"')
           .replace(/id="responseDuration"/g, 'id="updateResponseDuration"');
    }
    
    // Generate debugging HTML for query form
    const queryDebuggingContainer = document.getElementById('query-debugging-container');
    if (queryDebuggingContainer) {
        queryDebuggingContainer.innerHTML = CommonDebugging.createDebuggingHTML({
            requestLabel: 'Sent MCP Request to:',
            responseLabel: 'MCP Response:'
        }).replace(/id="requestUrl"/g, 'id="queryRequestUrl"')
           .replace(/id="requestTime"/g, 'id="queryRequestTime"')
           .replace(/id="sentRequest"/g, 'id="querySentRequest"')
           .replace(/id="receivedResponse"/g, 'id="queryReceivedResponse"')
           .replace(/id="responseDuration"/g, 'id="queryResponseDuration"');
    }
    
    // Set the MCP endpoint for both debugging instances
    updateDebugging.setEndpoint('/mcp/location');
    queryDebugging.setEndpoint('/mcp/location');
    
    // Initialize location update form
    const locationUpdateForm = document.getElementById('locationUpdateForm');
    
    locationUpdateForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(locationUpdateForm);
        const inputs = {
            latitude: formData.get('latitude'),
            longitude: formData.get('longitude')
        };

        // Start request timing
        updateDebugging.startRequest();
        
        try {
            // Create MCP request
            const mcpRequest = {
                jsonrpc: "2.0",
                id: 1,
                method: "tools/call",
                params: {
                    name: "update",
                    coords: {
                        latitude: parseFloat(inputs.latitude),
                        longitude: parseFloat(inputs.longitude)
                    }
                }
            };
            
            // Display the sent request
            updateDebugging.displaySentRequest(mcpRequest);
            
            // Send the request
            const response = await fetch('mcp/location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mcpRequest),
            });
            
            if (response.ok) {
                const data = await response.json();
                updateDebugging.completeRequest(data);
            } else {
                const errorText = `Error: ${response.status} - ${response.statusText}`;
                updateDebugging.completeRequest(errorText, true);
            }
        } catch (error) {
            updateDebugging.handleError(error);
        }
    });

    // Initialize location query form
    const locationQueryForm = document.getElementById('locationQueryForm');

    locationQueryForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Start request timing
        queryDebugging.startRequest();
        
        try {
            // Create MCP request
            const mcpRequest = {
                jsonrpc: "2.0",
                id: 1,
                method: "tools/call",
                params: {
                    name: "query",
                }
            };
            
            // Display the sent request
            queryDebugging.displaySentRequest(mcpRequest);
            
            // Send the request
            const response = await fetch('mcp/location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mcpRequest),
            });
            
            if (response.ok) {
                const data = await response.json();
                queryDebugging.completeRequest(data);
            } else {
                const errorText = `Error: ${response.status} - ${response.statusText}`;
                queryDebugging.completeRequest(errorText, true);
            }
        } catch (error) {
            queryDebugging.handleError(error);
        }
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey || event.metaKey) {
            switch(event.key) {
                case '1':
                    event.preventDefault();
                    locationUpdateForm.dispatchEvent(new Event('submit'));
                    break;
                case '2':
                    event.preventDefault();
                    locationQueryForm.dispatchEvent(new Event('submit'));
                    break;
            }
        }
    });

    // Add form validation feedback
    const inputs = locationUpdateForm.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.addEventListener('invalid', function(e) {
            e.preventDefault();
            this.classList.add('invalid');
        });
        
        input.addEventListener('input', function() {
            if (this.validity.valid) {
                this.classList.remove('invalid');
            }
        });
    });
});

// Utility functions for external use
function clearLocationResults() {
    CommonForm.clearResults('updateResults');
    CommonForm.clearResults('queryResults');
    
    // Clear debugging information for both forms
    if (updateDebugging) {
        updateDebugging.clear();
    }
    if (queryDebugging) {
        queryDebugging.clear();
    }
}

function showLocationMessage(message, type = 'info') {
    CommonForm.showMessage(message, type, 3000, 'updateResults');
}
