/**
 * Common Forms - Shared functionality for all MCP and A2A endpoint forms
 * Provides standardized form handling, API calling, and response management
 */

class CommonForm {
    constructor(config) {
        this.config = {
            endpoint: config.endpoint,
            method: config.method || 'POST',
            headers: config.headers || { 'Content-Type': 'application/json' },
            onSuccess: config.onSuccess || this.defaultSuccessHandler,
            onError: config.onError || this.defaultErrorHandler,
            onLoading: config.onLoading || this.defaultLoadingHandler,
            validateInputs: config.validateInputs || this.defaultValidateInputs,
            transformData: config.transformData || this.defaultTransformData,
            ...config
        };
        
        this.isLoading = false;
        this.currentButton = null;
    }

    /**
     * Default input validation - checks if required fields are filled
     */
    defaultValidateInputs(inputs) {
        const requiredFields = Object.keys(inputs).filter(key => 
            inputs[key] === '' || inputs[key] === null || inputs[key] === undefined
        );
        
        if (requiredFields.length > 0) {
            throw new Error(`Required fields missing: ${requiredFields.join(', ')}`);
        }
        
        return true;
    }

    /**
     * Default data transformation - returns data as-is
     */
    defaultTransformData(inputs) {
        return inputs;
    }

    /**
     * Default loading handler - shows loading state on button
     */
    defaultLoadingHandler(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.dataset.originalText = button.textContent;
            button.textContent = 'Loading...';
            button.classList.add('loading');
        } else {
            button.disabled = false;
            button.textContent = button.dataset.originalText || 'Submit';
            button.classList.remove('loading');
        }
    }

    /**
     * Default success handler - shows success message
     */
    defaultSuccessHandler(response, resultsElement, requestData) {
        if (resultsElement) {
            resultsElement.innerHTML = `
                <div class="response-success">
                    <h4>Success!</h4>
                    <div class="request-response-container">
                        <div class="request-section">
                            <h5>Request Body:</h5>
                            <pre class="request-json">${JSON.stringify(requestData, null, 2)}</pre>
                        </div>
                        <div class="response-section">
                            <h5>Response:</h5>
                            <pre class="response-json">${JSON.stringify(response, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            `;
            resultsElement.classList.add('success');
            
            // Auto-remove success styling after 5 seconds
            setTimeout(() => {
                resultsElement.classList.remove('success');
            }, 5000);
        }
    }

    /**
     * Default error handler - shows error message
     */
    defaultErrorHandler(error, resultsElement) {
        if (resultsElement) {
            resultsElement.innerHTML = `
                <div class="response-error">
                    <h4>❌ Error</h4>
                    <p>${error.message || 'An unexpected error occurred'}</p>
                    ${error.details ? `<pre>${JSON.stringify(error.details, null, 2)}</pre>` : ''}
                </div>
            `;
            resultsElement.classList.add('error');
            
            // Auto-remove error styling after 8 seconds
            setTimeout(() => {
                resultsElement.classList.remove('error');
            }, 8000);
        }
    }

    /**
     * Main method to handle form submission
     */
    async handleSubmit(inputs, button, resultsElementId = 'results') {
        if (this.isLoading) {
            return; // Prevent multiple simultaneous requests
        }

        this.currentButton = button;
        const resultsElement = document.getElementById(resultsElementId);

        try {
            // Validate inputs
            this.config.validateInputs(inputs);

            // Transform data if needed
            const requestData = this.config.transformData(inputs);

            // Show loading state
            this.isLoading = true;
            this.config.onLoading(button, true);

            // Make API call
            const response = await this.makeApiCall(requestData);

            // Handle success
            this.config.onSuccess(response, resultsElement, requestData);

        } catch (error) {
            // Handle error
            this.config.onError(error, resultsElement);
        } finally {
            // Reset loading state
            this.isLoading = false;
            this.config.onLoading(button, false);
        }
    }

    /**
     * Make the actual API call
     */
    async makeApiCall(data) {
        const response = await fetch(this.config.endpoint, {
            method: this.config.method,
            headers: this.config.headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch {
                errorData = { message: errorText };
            }
            
            throw new Error(`HTTP ${response.status}: ${response.statusText}`, {
                cause: errorData
            });
        }

        return await response.json();
    }

    /**
     * Create a standardized form with common styling and behavior
     */
    static createForm(config) {
        const form = document.createElement('form');
        form.className = 'common-form';
        
        // Add form fields
        if (config.fields) {
            config.fields.forEach(field => {
                const fieldGroup = CommonForm.createFieldGroup(field);
                form.appendChild(fieldGroup);
            });
        }

        // Add submit button
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = config.submitText || 'Submit';
        submitButton.className = 'submit-button';
        form.appendChild(submitButton);

        // Add results container
        const resultsDiv = document.createElement('div');
        resultsDiv.id = 'results';
        resultsDiv.className = 'results';
        form.appendChild(resultsDiv);

        return form;
    }

    /**
     * Create a standardized field group
     */
    static createFieldGroup(field) {
        const fieldGroup = document.createElement('div');
        fieldGroup.className = 'input-group';

        const label = document.createElement('label');
        label.htmlFor = field.id;
        label.textContent = field.label;
        fieldGroup.appendChild(label);

        let input;
        if (field.type === 'textarea') {
            input = document.createElement('textarea');
            input.rows = field.rows || 3;
        } else if (field.type === 'select') {
            input = document.createElement('select');
            if (field.options) {
                field.options.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.value;
                    optionElement.textContent = option.text;
                    if (option.selected) optionElement.selected = true;
                    input.appendChild(optionElement);
                });
            }
        } else {
            input = document.createElement('input');
            input.type = field.type || 'text';
        }

        input.id = field.id;
        input.name = field.id;
        if (field.placeholder) input.placeholder = field.placeholder;
        if (field.value !== undefined) input.value = field.value;
        if (field.required) input.required = true;
        if (field.step) input.step = field.step;
        if (field.min) input.min = field.min;
        if (field.max) input.max = field.max;

        fieldGroup.appendChild(input);
        return fieldGroup;
    }

    /**
     * Get all form inputs as an object
     */
    static getFormInputs(formElement) {
        const inputs = {};
        const formData = new FormData(formElement);
        
        for (const [key, value] of formData.entries()) {
            inputs[key] = value;
        }
        
        return inputs;
    }

    /**
     * Clear form results
     */
    static clearResults(resultsElementId = 'results') {
        const resultsElement = document.getElementById(resultsElementId);
        if (resultsElement) {
            resultsElement.innerHTML = '';
            resultsElement.className = 'results';
        }
    }

    /**
     * Show a temporary message
     */
    static showMessage(message, type = 'info', duration = 3000, resultsElementId = 'results') {
        const resultsElement = document.getElementById(resultsElementId);
        if (resultsElement) {
            resultsElement.innerHTML = `
                <div class="response-${type}">
                    <h4>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'} ${type.charAt(0).toUpperCase() + type.slice(1)}</h4>
                    <p>${message}</p>
                </div>
            `;
            resultsElement.classList.add(type);
            
            setTimeout(() => {
                resultsElement.classList.remove(type);
            }, duration);
        }
    }
}

/**
 * Pre-configured form handlers for common endpoint types
 */
const FormHandlers = {
    /**
     * MCP Protocol form handler
     */
    mcp: (endpoint, methodName, arguments = {}) => {
        return new CommonForm({
            endpoint: endpoint,
            transformData: (inputs) => ({
                jsonrpc: '2.0',
                id: Date.now(),
                method: 'tools/call',
                params: {
                    name: methodName,
                    arguments: arguments
                }
            }),
            onSuccess: (response, resultsElement, requestData) => {
                if (resultsElement) {
                    resultsElement.innerHTML = `
                        <div class="response-success">
                            <h4>MCP ${methodName} Success!</h4>
                            <div class="request-response-container">
                                <div class="request-section">
                                    <h5>Request Body:</h5>
                                    <pre class="request-json">${JSON.stringify(requestData, null, 2)}</pre>
                                </div>
                                <div class="response-section">
                                    <h5>Response:</h5>
                                    <pre class="response-json">${JSON.stringify(response, null, 2)}</pre>
                                </div>
                            </div>
                        </div>
                    `;
                    resultsElement.classList.add('success');
                    
                    setTimeout(() => {
                        resultsElement.classList.remove('success');
                    }, 5000);
                }
            }
        });
    },

    /**
     * A2A TaskHandler form handler
     */
    a2a: (endpoint, taskType = 'chat') => {
        return new CommonForm({
            endpoint: endpoint,
            transformData: (inputs) => ({
                task: taskType,
                message: inputs.message || inputs.input || '',
                ...inputs
            }),
            onSuccess: (response, resultsElement, requestData) => {
                if (resultsElement) {
                    resultsElement.innerHTML = `
                        <div class="response-success">
                            <h4>A2A ${taskType} Success!</h4>
                            <div class="request-response-container">
                                <div class="request-section">
                                    <h5>Request Body:</h5>
                                    <pre class="request-json">${JSON.stringify(requestData, null, 2)}</pre>
                                </div>
                                <div class="response-section">
                                    <h5>Response:</h5>
                                    <pre class="response-json">${JSON.stringify(response, null, 2)}</pre>
                                </div>
                            </div>
                        </div>
                    `;
                    resultsElement.classList.add('success');
                    
                    setTimeout(() => {
                        resultsElement.classList.remove('success');
                    }, 5000);
                }
            }
        });
    }
};

/**
 * Utility function to create a simple form with common styling
 */
function createSimpleForm(config) {
    const form = CommonForm.createForm(config);
    
    // Add event listener
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const inputs = CommonForm.getFormInputs(form);
        const submitButton = form.querySelector('.submit-button');
        
        // Use the appropriate handler
        const handler = config.handler || FormHandlers.mcp(config.endpoint, config.methodName);
        
        await handler.handleSubmit(inputs, submitButton);
    });
    
    return form;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CommonForm, FormHandlers, createSimpleForm };
}
