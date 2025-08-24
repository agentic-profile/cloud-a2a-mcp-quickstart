// Form Examples - Demonstrating the Common Form system
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Basic MCP Form
    const basicMcpForm = document.getElementById('basicMcpForm');
    const basicMcpHandler = FormHandlers.mcp('/mcp/example', 'process', {
        input: ''
    });

    basicMcpForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(basicMcpForm);
        const inputs = {
            input: formData.get('basicInput')
        };

        const submitButton = basicMcpForm.querySelector('.submit-button');
        await basicMcpHandler.handleSubmit(inputs, submitButton, 'basicResults');
    });

    // Initialize A2A Form
    const a2aForm = document.getElementById('a2aForm');
    const a2aHandler = FormHandlers.a2a('/a2a/example', 'task');

    a2aForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(a2aForm);
        const inputs = {
            message: formData.get('taskMessage'),
            priority: formData.get('taskPriority')
        };

        const submitButton = a2aForm.querySelector('.submit-button');
        await a2aHandler.handleSubmit(inputs, submitButton, 'a2aResults');
    });

    // Initialize Custom Form with custom validation and transformation
    const customForm = document.getElementById('customForm');
    const customHandler = new CommonForm({
        endpoint: '/api/custom',
        validateInputs: function(inputs) {
            // Custom validation
            if (!inputs.emailInput.includes('@')) {
                throw new Error('Please enter a valid email address');
            }
            
            if (inputs.phoneInput.length < 10) {
                throw new Error('Phone number must be at least 10 digits');
            }
            
            if (parseInt(inputs.ageInput) < 18) {
                throw new Error('Must be at least 18 years old');
            }
            
            return true;
        },
        transformData: function(inputs) {
            // Custom data transformation
            return {
                user: {
                    email: inputs.emailInput.toLowerCase().trim(),
                    phone: inputs.phoneInput.replace(/\D/g, ''),
                    age: parseInt(inputs.ageInput),
                    timestamp: new Date().toISOString()
                }
            };
        },
        onSuccess: function(response, resultsElement) {
            if (resultsElement) {
                resultsElement.innerHTML = `
                    <div class="response-success">
                        <h4>✅ Custom Form Success!</h4>
                        <p>User data processed successfully</p>
                        <pre>${JSON.stringify(response, null, 2)}</pre>
                    </div>
                `;
                resultsElement.classList.add('success');
                
                setTimeout(() => {
                    resultsElement.classList.remove('success');
                }, 5000);
            }
        },
        onError: function(error, resultsElement) {
            if (resultsElement) {
                resultsElement.innerHTML = `
                    <div class="response-error">
                        <h4>❌ Custom Form Error</h4>
                        <p>${error.message}</p>
                        ${error.cause ? `<pre>${JSON.stringify(error.cause, null, 2)}</pre>` : ''}
                    </div>
                `;
                resultsElement.classList.add('error');
                
                setTimeout(() => {
                    resultsElement.classList.remove('error');
                }, 8000);
            }
        }
    });

    customForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(customForm);
        const inputs = {
            emailInput: formData.get('emailInput'),
            phoneInput: formData.get('phoneInput'),
            ageInput: formData.get('ageInput')
        };

        const submitButton = customForm.querySelector('.submit-button');
        await customHandler.handleSubmit(inputs, submitButton, 'customResults');
    });

    // Initialize Multi-Action Form
    const multiActionForm = document.getElementById('multiActionForm');
    
    multiActionForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = e.submitter;
        const action = submitButton.dataset.action;
        
        if (action === 'process') {
            await handleMultiAction('process', submitButton);
        } else if (action === 'validate') {
            await handleMultiAction('validate', submitButton);
        }
    });

    // Add form validation feedback
    const allInputs = document.querySelectorAll('input[required], select[required], textarea[required]');
    allInputs.forEach(input => {
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

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey || event.metaKey) {
            switch(event.key) {
                case '1':
                    event.preventDefault();
                    basicMcpForm.dispatchEvent(new Event('submit'));
                    break;
                case '2':
                    event.preventDefault();
                    a2aForm.dispatchEvent(new Event('submit'));
                    break;
                case '3':
                    event.preventDefault();
                    customForm.dispatchEvent(new Event('submit'));
                    break;
            }
        }
    });
});

// Handle multi-action form submissions
async function handleMultiAction(action, submitButton) {
    const form = document.getElementById('multiActionForm');
    const formData = new FormData(form);
    const inputs = {
        data: formData.get('multiInput'),
        action: action
    };

    const resultsElement = document.getElementById('multiResults');
    
    try {
        // Show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Processing...';
        submitButton.classList.add('loading');
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        resultsElement.innerHTML = `
            <div class="response-success">
                <h4>✅ ${action.charAt(0).toUpperCase() + action.slice(1)} Success!</h4>
                <p>Data: ${inputs.data}</p>
                <p>Action: ${action}</p>
                <p>Timestamp: ${new Date().toLocaleString()}</p>
            </div>
        `;
        resultsElement.classList.add('success');
        
        setTimeout(() => {
            resultsElement.classList.remove('success');
        }, 5000);
        
    } catch (error) {
        resultsElement.innerHTML = `
            <div class="response-error">
                <h4>❌ ${action.charAt(0).toUpperCase() + action.slice(1)} Error</h4>
                <p>${error.message}</p>
            </div>
        `;
        resultsElement.classList.add('error');
        
        setTimeout(() => {
            resultsElement.classList.remove('error');
        }, 8000);
    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.textContent = action === 'process' ? 'Process Data' : 'Validate Only';
        submitButton.classList.remove('loading');
    }
}

// Clear multi-action form results
function clearMultiResults() {
    CommonForm.clearResults('multiResults');
}

// Create a dynamic form programmatically
function createDynamicForm() {
    const container = document.getElementById('dynamicFormContainer');
    
    // Clear existing form
    container.innerHTML = '';
    
    // Create form configuration
    const formConfig = {
        fields: [
            {
                id: 'dynamicName',
                label: 'Full Name',
                type: 'text',
                placeholder: 'Enter your full name',
                required: true
            },
            {
                id: 'dynamicEmail',
                label: 'Email',
                type: 'email',
                placeholder: 'Enter your email',
                required: true
            },
            {
                id: 'dynamicBio',
                label: 'Biography',
                type: 'textarea',
                placeholder: 'Tell us about yourself',
                rows: 4,
                required: false
            },
            {
                id: 'dynamicCountry',
                label: 'Country',
                type: 'select',
                options: [
                    { value: '', text: 'Select a country' },
                    { value: 'us', text: 'United States' },
                    { value: 'ca', text: 'Canada' },
                    { value: 'uk', text: 'United Kingdom' },
                    { value: 'au', text: 'Australia' }
                ],
                required: true
            }
        ],
        submitText: 'Submit Dynamic Form',
        endpoint: '/api/dynamic',
        handler: new CommonForm({
            endpoint: '/api/dynamic',
            onSuccess: function(response, resultsElement) {
                if (resultsElement) {
                    resultsElement.innerHTML = `
                        <div class="response-success">
                            <h4>✅ Dynamic Form Success!</h4>
                            <p>Form submitted successfully</p>
                            <pre>${JSON.stringify(response, null, 2)}</pre>
                        </div>
                    `;
                    resultsElement.classList.add('success');
                    
                    setTimeout(() => {
                        resultsElement.classList.remove('success');
                    }, 5000);
                }
            }
        })
    };
    
    // Create and add the form
    const dynamicForm = createSimpleForm(formConfig);
    container.appendChild(dynamicForm);
    
    // Add some styling to the container
    container.style.marginTop = '1rem';
    container.style.padding = '1rem';
    container.style.border = '1px solid var(--md-border)';
    container.style.borderRadius = '6px';
    container.style.backgroundColor = 'var(--md-bg-primary)';
}

// Utility function to show messages
function showExampleMessage(message, type = 'info', duration = 3000) {
    CommonForm.showMessage(message, type, duration, 'basicResults');
}
