# Common Forms System

A standardized form handling system for MCP (Model Context Protocol) and A2A (Agent-to-Agent) endpoints in the Agentic Profile MCP Service.

## Overview

The Common Forms system provides a consistent, reusable way to create forms that interact with MCP and A2A endpoints. It handles:

- **Form validation** - Built-in and custom validation rules
- **Data transformation** - Automatic formatting for different endpoint types
- **Loading states** - Visual feedback during API calls
- **Response handling** - Success/error messages with auto-dismiss
- **Accessibility** - Proper labels, ARIA attributes, and keyboard navigation

## Quick Start

### 1. Include the Common Forms Script

```html
<script src="common-forms.js"></script>
```

### 2. Create a Basic Form

```html
<form class="common-form" id="myForm">
    <div class="input-group">
        <label for="inputField">Input Label</label>
        <input type="text" id="inputField" name="inputField" required />
    </div>
    <button type="submit" class="submit-button">Submit</button>
    <div id="results" class="results"></div>
</form>
```

### 3. Initialize with JavaScript

```javascript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('myForm');
    const handler = FormHandlers.mcp('/mcp/endpoint', 'methodName');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const inputs = {
            field: formData.get('inputField')
        };
        
        const submitButton = form.querySelector('.submit-button');
        await handler.handleSubmit(inputs, submitButton, 'results');
    });
});
```

## Form Types

### MCP Protocol Forms

Use `FormHandlers.mcp()` for MCP protocol endpoints:

```javascript
const mcpHandler = FormHandlers.mcp('/mcp/location', 'update', {
    coords: {
        latitude: 0,
        longitude: 0
    }
});
```

This automatically formats data as:
```json
{
    "jsonrpc": "2.0",
    "id": 1234567890,
    "method": "tools/call",
    "params": {
        "name": "update",
        "arguments": {
            "coords": {
                "latitude": 0,
                "longitude": 0
            }
        }
    }
}
```

### A2A TaskHandler Forms

Use `FormHandlers.a2a()` for A2A endpoints:

```javascript
const a2aHandler = FormHandlers.a2a('/a2a/venture', 'chat');
```

This formats data as:
```json
{
    "task": "chat",
    "message": "user input",
    "additional": "fields"
}
```

### Custom Forms

Create completely custom forms with the `CommonForm` class:

```javascript
const customHandler = new CommonForm({
    endpoint: '/api/custom',
    validateInputs: function(inputs) {
        // Custom validation logic
        if (!inputs.email.includes('@')) {
            throw new Error('Invalid email address');
        }
        return true;
    },
    transformData: function(inputs) {
        // Custom data transformation
        return {
            user: {
                email: inputs.email.toLowerCase(),
                timestamp: new Date().toISOString()
            }
        };
    },
    onSuccess: function(response, resultsElement) {
        // Custom success handling
        resultsElement.innerHTML = `<h4>Success!</h4><p>${response.message}</p>`;
    },
    onError: function(error, resultsElement) {
        // Custom error handling
        resultsElement.innerHTML = `<h4>Error!</h4><p>${error.message}</p>`;
    }
});
```

## Form Configuration Options

### Field Types

The system supports all standard HTML input types:

- **Text inputs**: `text`, `email`, `tel`, `number`, `password`
- **Select dropdowns**: `select` with options
- **Textareas**: `textarea` with configurable rows
- **Special inputs**: `date`, `time`, `url`, etc.

### Validation

Built-in validation includes:
- Required field checking
- HTML5 validation (email, number ranges, etc.)
- Custom validation functions

### Styling Classes

Available CSS classes for customization:
- `.common-form` - Main form container
- `.form-section` - Section wrapper with background
- `.input-group` - Input field wrapper
- `.submit-button` - Submit button styling
- `.results` - Results display area
- `.button-group` - Multiple button layout

## Advanced Features

### Dynamic Form Creation

Create forms programmatically:

```javascript
const formConfig = {
    fields: [
        {
            id: 'name',
            label: 'Name',
            type: 'text',
            required: true
        },
        {
            id: 'category',
            label: 'Category',
            type: 'select',
            options: [
                { value: 'option1', text: 'Option 1' },
                { value: 'option2', text: 'Option 2' }
            ]
        }
    ],
    submitText: 'Submit Form',
    endpoint: '/api/endpoint'
};

const dynamicForm = createSimpleForm(formConfig);
container.appendChild(dynamicForm);
```

### Multiple Submit Buttons

Handle different actions with the same form:

```html
<form class="common-form" id="multiForm">
    <div class="input-group">
        <label for="data">Data</label>
        <input type="text" id="data" name="data" required />
    </div>
    <div class="button-group">
        <button type="submit" class="submit-button" data-action="process">Process</button>
        <button type="submit" class="submit-button secondary" data-action="validate">Validate</button>
    </div>
    <div id="results" class="results"></div>
</form>
```

```javascript
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const action = e.submitter.dataset.action;
    
    if (action === 'process') {
        await handleProcess(e.submitter);
    } else if (action === 'validate') {
        await handleValidate(e.submitter);
    }
});
```

### Keyboard Shortcuts

Built-in keyboard navigation:
- `Ctrl/Cmd + 1` - Submit first form
- `Ctrl/Cmd + 2` - Submit second form
- `Ctrl/Cmd + 3` - Submit third form

Customize shortcuts in your form initialization code.

## Response Handling

### Success Responses

Successful API calls automatically show:
- ✅ Success icon
- Response data in formatted JSON
- Auto-dismiss after 5 seconds
- Green styling

### Error Responses

Failed API calls show:
- ❌ Error icon
- Error message
- Technical details (if available)
- Auto-dismiss after 8 seconds
- Red styling

### Loading States

During API calls:
- Button shows "Loading..." text
- Button is disabled
- Spinning animation
- Prevents multiple submissions

## Utility Functions

### Clear Results

```javascript
CommonForm.clearResults('resultsElementId');
```

### Show Messages

```javascript
CommonForm.showMessage('Custom message', 'info', 3000, 'resultsElementId');
```

### Get Form Data

```javascript
const inputs = CommonForm.getFormInputs(formElement);
```

## CSS Customization

The system uses CSS custom properties for easy theming:

```css
:root {
    --md-primary: #2196f3;        /* Primary button color */
    --md-success: #4caf50;        /* Success state color */
    --md-error: #f44336;          /* Error state color */
    --md-info: #17a2b8;           /* Info state color */
    --md-border: #e0e0e0;         /* Border color */
    --md-bg-primary: #ffffff;     /* Background color */
}
```

## Best Practices

1. **Always use proper labels** - Screen readers and accessibility
2. **Include required attributes** - HTML5 validation
3. **Use appropriate input types** - Better mobile experience
4. **Handle errors gracefully** - User-friendly error messages
5. **Test loading states** - Ensure good UX during API calls
6. **Validate on both client and server** - Security and reliability

## Examples

See `www/form-examples.html` for comprehensive examples of:
- Basic MCP forms
- A2A TaskHandler forms
- Custom validation forms
- Multi-action forms
- Dynamic form creation

## Browser Support

- Modern browsers (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- ES6+ features required
- CSS Grid and Flexbox for layout
- CSS custom properties for theming

## Troubleshooting

### Common Issues

1. **Form not submitting** - Check if `preventDefault()` is called
2. **Results not showing** - Verify results element ID matches
3. **Styling not applied** - Ensure `common-forms.js` is loaded
4. **Validation not working** - Check required attributes and validation functions

### Debug Mode

Enable debug logging by setting:

```javascript
localStorage.setItem('commonFormsDebug', 'true');
```

## Contributing

When adding new features to the Common Forms system:

1. Maintain backward compatibility
2. Add comprehensive examples
3. Update this documentation
4. Test across different browsers
5. Follow existing code style

## License

This Common Forms system is part of the Agentic Profile MCP Service and follows the same license terms.
