// Business matching using the Common Form system
document.addEventListener('DOMContentLoaded', function() {
    // Initialize business add form
    const businessAddForm = document.getElementById('businessAddForm');
    const businessAddHandler = FormHandlers.mcp('/mcp/match', 'add', {
        business: {
            name: '',
            description: '',
            category: '',
            location: {
                latitude: 0,
                longitude: 0
            },
            address: ''
        }
    });

    businessAddForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(businessAddForm);
        const inputs = {
            businessName: formData.get('businessName'),
            businessDescription: formData.get('businessDescription'),
            businessCategory: formData.get('businessCategory'),
            businessLatitude: formData.get('businessLatitude'),
            businessLongitude: formData.get('businessLongitude'),
            businessAddress: formData.get('businessAddress')
        };

        // Transform inputs for the MCP call
        const transformedInputs = {
            business: {
                name: inputs.businessName,
                description: inputs.businessDescription,
                category: inputs.businessCategory,
                location: {
                    latitude: parseFloat(inputs.businessLatitude),
                    longitude: parseFloat(inputs.businessLongitude)
                },
                address: inputs.businessAddress
            }
        };

        const submitButton = businessAddForm.querySelector('.submit-button');
        await businessAddHandler.handleSubmit(transformedInputs, submitButton, 'addResults');
    });

    // Initialize business find form
    const businessFindForm = document.getElementById('businessFindForm');
    const businessFindHandler = FormHandlers.mcp('/mcp/match', 'find', {
        query: '',
        location: {
            latitude: 0,
            longitude: 0
        }
    });

    businessFindForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(businessFindForm);
        const inputs = {
            searchQuery: formData.get('searchQuery'),
            searchLatitude: formData.get('searchLatitude'),
            searchLongitude: formData.get('searchLongitude')
        };

        // Transform inputs for the MCP call
        const transformedInputs = {
            query: inputs.searchQuery,
            location: {
                latitude: parseFloat(inputs.searchLatitude),
                longitude: parseFloat(inputs.searchLongitude)
            }
        };

        const submitButton = businessFindForm.querySelector('.submit-button');
        await businessFindHandler.handleSubmit(transformedInputs, submitButton, 'findResults');
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey || event.metaKey) {
            switch(event.key) {
                case '1':
                    event.preventDefault();
                    businessAddForm.dispatchEvent(new Event('submit'));
                    break;
                case '2':
                    event.preventDefault();
                    businessFindForm.dispatchEvent(new Event('submit'));
                    break;
            }
        }
    });

    // Add form validation feedback
    const allInputs = document.querySelectorAll('input[required], select[required]');
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

    // Add select change handler for better UX
    const categorySelect = document.getElementById('businessCategory');
    categorySelect.addEventListener('change', function() {
        this.classList.remove('invalid');
    });
});

// Utility functions for external use
function clearBusinessResults() {
    CommonForm.clearResults('addResults');
    CommonForm.clearResults('findResults');
}

function showBusinessMessage(message, type = 'info') {
    CommonForm.showMessage(message, type, 3000, 'addResults');
}
