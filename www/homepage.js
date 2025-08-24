// Homepage functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check service status on page load
    checkServiceStatus();
    
    // Add loading states to navigation cards
    const navCards = document.querySelectorAll('.nav-card');
    
    navCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add loading state
            const originalContent = this.innerHTML;
            this.innerHTML = '<div class="nav-icon">⏳</div><h3>Loading...</h3>';
            
            // Reset after navigation (will be overridden by page change)
            setTimeout(() => {
                this.innerHTML = originalContent;
            }, 2000);
        });
    });
});

async function checkServiceStatus() {
    const serviceStatusDiv = document.getElementById('serviceStatus');
    
    try {
        const response = await fetch('/status');
        if (response.ok) {
            const data = await response.json();
            serviceStatusDiv.innerHTML = `<span style="color: #28a745;">✅ Online</span><br><small>Started: ${new Date(data.started).toLocaleString()}</small>`;
        } else {
            serviceStatusDiv.innerHTML = `<span style="color: #dc3545;">❌ Offline</span><br><small>Status: ${response.status}</small>`;
        }
    } catch (error) {
        serviceStatusDiv.innerHTML = `<span style="color: #dc3545;">❌ Error</span><br><small>${error.message}</small>`;
    }
}

// Add keyboard shortcuts for navigation
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) {
        switch(event.key) {
            case '1':
                event.preventDefault();
                window.location.href = 'endpoints.html';
                break;
            case '2':
                event.preventDefault();
                window.location.href = 'api-testing.html';
                break;
            case '3':
                event.preventDefault();
                window.location.href = 'location.html';
                break;
            case '4':
                event.preventDefault();
                window.location.href = 'match.html';
                break;
            case '5':
                event.preventDefault();
                window.location.href = 'venture.html';
                break;
            case '6':
                event.preventDefault();
                window.location.href = 'chat.html';
                break;
        }
    }
});
