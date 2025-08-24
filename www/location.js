// Location testing using the Common Form system
document.addEventListener('DOMContentLoaded', function() {
    // Initialize location update form
    const locationUpdateForm = document.getElementById('locationUpdateForm');
    
    locationUpdateForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(locationUpdateForm);
        const inputs = {
            latitude: formData.get('latitude'),
            longitude: formData.get('longitude')
        };

        // Create MCP handler with the actual form data
        const locationUpdateHandler = FormHandlers.mcp('/mcp/location', 'update', {
            coords: {
                latitude: parseFloat(inputs.latitude),
                longitude: parseFloat(inputs.longitude)
            }
        });

        const submitButton = locationUpdateForm.querySelector('.submit-button');
        await locationUpdateHandler.handleSubmit({}, submitButton, 'updateResults');
    });

    // Initialize location query form
    const locationQueryForm = document.getElementById('locationQueryForm');
    const locationQueryHandler = FormHandlers.mcp('/mcp/location', 'query', {});

    locationQueryForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = locationQueryForm.querySelector('.submit-button');
        await locationQueryHandler.handleSubmit({}, submitButton, 'queryResults');
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
}

function showLocationMessage(message, type = 'info') {
    CommonForm.showMessage(message, type, 3000, 'updateResults');
}
