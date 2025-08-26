// Common Debugging Component for MCP and A2A endpoints
class CommonDebugging {
    constructor(options = {}) {
        this.requestUrlElement = options.requestUrlElement || 'requestUrl';
        this.requestTimeElement = options.requestTimeElement || 'requestTime';
        this.sentRequestElement = options.sentRequestElement || 'sentRequest';
        this.receivedResponseElement = options.receivedResponseElement || 'receivedResponse';
        this.responseDurationElement = options.responseDurationElement || 'responseDuration';
        this.endpoint = options.endpoint || '';
        this.requestStartTime = null;
    }

    // Update the request URL display
    updateRequestUrl() {
        try {
            const fullUrl = `${window.location.origin}${this.endpoint}`;
            console.log('Updating request URL to:', fullUrl);
            const requestUrlElement = document.getElementById(this.requestUrlElement);
            if (requestUrlElement) {
                requestUrlElement.textContent = fullUrl;
                console.log('Successfully updated request URL');
            } else {
                console.error('requestUrl element not found');
            }
        } catch (error) {
            console.error('Error updating request URL:', error);
        }
    }

    // Set the endpoint and update URL display
    setEndpoint(endpoint) {
        this.endpoint = endpoint;
        this.updateRequestUrl();
    }

    // Record request start time
    startRequest() {
        this.requestStartTime = new Date();
        const requestTimeString = this.requestStartTime.toLocaleTimeString();
        
        // Update request time display
        const requestTimeElement = document.getElementById(this.requestTimeElement);
        if (requestTimeElement) {
            requestTimeElement.textContent = requestTimeString;
        }
    }

    // Display the sent request
    displaySentRequest(requestData) {
        const sentRequestElement = document.getElementById(this.sentRequestElement);
        if (sentRequestElement) {
            sentRequestElement.textContent = JSON.stringify(requestData, null, 2);
        }
    }

    // Complete the request and calculate duration
    completeRequest(responseData, isError = false) {
        if (this.requestStartTime) {
            const responseEndTime = new Date();
            const responseDuration = ((responseEndTime - this.requestStartTime) / 1000).toFixed(2);
            
            // Display the received response
            const receivedResponseElement = document.getElementById(this.receivedResponseElement);
            if (receivedResponseElement) {
                if (isError) {
                    receivedResponseElement.textContent = responseData;
                } else {
                    receivedResponseElement.textContent = JSON.stringify(responseData, null, 4);
                }
            }
            
            // Update response duration
            const responseDurationElement = document.getElementById(this.responseDurationElement);
            if (responseDurationElement) {
                responseDurationElement.textContent = responseDuration;
            }
        }
    }

    // Handle network errors
    handleError(error) {
        const errorText = `Network error: ${error.message}`;
        this.completeRequest(errorText, true);
    }

    // Clear all debugging information
    clear() {
        this.requestStartTime = null;
        
        const sentRequestElement = document.getElementById(this.sentRequestElement);
        if (sentRequestElement) {
            sentRequestElement.textContent = 'No request sent yet';
        }
        
        const receivedResponseElement = document.getElementById(this.receivedResponseElement);
        if (receivedResponseElement) {
            receivedResponseElement.textContent = 'No response received yet';
        }
        
        const requestTimeElement = document.getElementById(this.requestTimeElement);
        if (requestTimeElement) {
            requestTimeElement.textContent = '-';
        }
        
        const responseDurationElement = document.getElementById(this.responseDurationElement);
        if (responseDurationElement) {
            responseDurationElement.textContent = '-';
        }
    }

    // Create the debugging HTML structure
    static createDebuggingHTML(options = {}) {
        const {
            showRequestUrl = true,
            showRequestTime = true,
            showResponseDuration = true,
            requestLabel = 'Sent Request to:',
            responseLabel = 'Response:'
        } = options;

        let html = '<div class="request-response-display">';
        
        html += '<div class="json-section">';
        if (showRequestUrl) {
            html += `<h4>${requestLabel} <span id="requestUrl" class="request-url">Loading...</span></h4>`;
        }
        if (showRequestTime) {
            html += '<div class="request-time">Request sent at: <span id="requestTime">-</span></div>';
        }
        html += '<pre id="sentRequest" class="json-display">No request sent yet</pre>';
        html += '</div>';
        
        html += '<div class="json-section">';
        html += `<h4>${responseLabel}</h4>`;
        if (showResponseDuration) {
            html += '<div class="response-time">Response received in: <span id="responseDuration">-</span> seconds</div>';
        }
        html += '<pre id="receivedResponse" class="json-display">No response received yet</pre>';
        html += '</div>';
        
        html += '</div>';
        
        return html;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CommonDebugging;
}
