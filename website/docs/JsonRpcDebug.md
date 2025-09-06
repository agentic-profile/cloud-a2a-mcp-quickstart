# JsonRpcDebug Component

A React component that automatically sends JSON RPC requests and displays request/response information from MCP agents.

## Features

- **Automatic Request Handling**: Automatically sends requests when the `request` prop changes
- **Request/Response Display**: View both sent requests and received responses
- **Error Handling**: Clear error messages for various failure scenarios
- **Loading States**: Visual feedback during request processing
- **Self-Contained**: Handles the complete request lifecycle internally

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `agentUrl` | `string` | Yes | The URL endpoint of the agent |
| `request` | `any` | No | The JSON RPC request to send (triggers automatic sending) |
| `onResult` | `(result: any) => void` | No | Callback function called with the response |
| `className` | `string` | No | Additional CSS classes |

## Usage

### Basic Usage

```tsx
import { JsonRpcDebug } from '@/components';

<JsonRpcDebug
    agentUrl="https://api.example.com/agent"
    request={jsonRpcRequest}
    onResult={(result) => console.log('Response:', result)}
/>
```

### With State Management

```tsx
const [request, setRequest] = useState(null);

const handleSendRequest = () => {
    const jsonRpcRequest = {
        jsonrpc: '2.0',
        id: Date.now().toString(),
        method: 'tools/list',
        params: { name: 'venture' }
    };
    
    // Setting the request will automatically trigger JsonRpcDebug to send it
    setRequest(jsonRpcRequest);
};

<JsonRpcDebug
    agentUrl={agentUrl}
    request={request}
    onResult={handleResult}
/>
```

## Component Behavior

The component automatically handles the complete request lifecycle:

1. **Request Detection**: When the `request` prop changes, it automatically sends the request
2. **Loading State**: Shows loading indicator while request is in progress
3. **Response Handling**: Displays the response when received
4. **Error Handling**: Shows error messages if the request fails
5. **Callback Execution**: Calls `onResult` callback with the response data

### Automatic Request Triggering

The component uses a `useEffect` hook to automatically send requests:

```tsx
useEffect(() => {
    if (request && agentUrl) {
        handleSendRequest(request);
    }
}, [request, agentUrl]);
```

This means:
- Setting a new `request` value automatically triggers the request
- The component handles all the fetch logic internally
- No need to manually call send functions

## Styling

The component uses the existing design system:
- Follows the same Card and Button component patterns
- Supports dark/light theme switching
- Responsive design for mobile and desktop
- Consistent spacing and typography

## Integration

The component is designed to work seamlessly with:
- Existing agent data structures
- MCP service configurations
- React state management
- Theme switching systems

## Architecture Benefits

This refactored component provides several benefits:

1. **🎯 Single Responsibility**: Handles both display and request logic
2. **♻️ Reusability**: Can be used anywhere you need JSON RPC debugging
3. **🔄 Automatic Behavior**: No need to manually trigger requests
4. **🧪 Testability**: Self-contained and easier to test
5. **🛠️ Maintainability**: All request logic in one place

## Example Integration Patterns

### Simple Request Triggering
```tsx
const [request, setRequest] = useState(null);

<Button onClick={() => setRequest({ method: 'test', params: {} })}>
    Send Test Request
</Button>

<JsonRpcDebug agentUrl={agentUrl} request={request} />
```

### With Result Handling
```tsx
<JsonRpcDebug
    agentUrl={agentUrl}
    request={request}
    onResult={(result) => {
        console.log('Got response:', result);
        // Handle the response
    }}
/>
```

### In Forms
```tsx
const handleSubmit = (formData) => {
    const jsonRpcRequest = {
        jsonrpc: '2.0',
        id: Date.now().toString(),
        method: 'submit',
        params: formData
    };
    setRequest(jsonRpcRequest);
};

<JsonRpcDebug agentUrl={agentUrl} request={request} />
```

## Request Lifecycle

1. **Initial State**: Component renders with no request
2. **Request Set**: Parent component sets `request` prop
3. **Auto-Trigger**: Component automatically sends the request
4. **Loading**: Shows loading state during request
5. **Response**: Displays response or error
6. **Callback**: Executes `onResult` callback if provided

## Error Scenarios

The component handles various error cases:
- Network connection failures
- HTTP error responses
- JSON RPC protocol errors
- Agent endpoint unavailability
- Invalid request formats
