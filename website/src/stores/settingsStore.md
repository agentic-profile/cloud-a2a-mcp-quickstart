# Settings Store

The settings store is a Zustand-based state management solution for application settings with persistence.

## Features

- **Persistent Storage**: Settings are automatically saved to localStorage
- **TypeScript Support**: Fully typed for better development experience
- **Reactive Updates**: Components automatically update when settings change

## Available Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `serverUrl` | string | `'http://localhost:3000'` | Server URL for API endpoints |
| `darkMode` | boolean | `false` | Dark mode toggle |
| `notifications` | boolean | `true` | Notifications toggle |
| `autoSave` | boolean | `true` | Auto-save toggle |
| `language` | string | `'en'` | Application language |

## Usage

### In Components

```tsx
import { useSettingsStore } from '@/stores';

const MyComponent = () => {
  const { serverUrl, setServerUrl, darkMode, setDarkMode } = useSettingsStore();

  const handleServerUrlChange = (newUrl: string) => {
    setServerUrl(newUrl);
  };

  return (
    <div>
      <p>Current Server URL: {serverUrl}</p>
      <input 
        value={serverUrl}
        onChange={(e) => setServerUrl(e.target.value)}
        placeholder="http://localhost:3000"
      />
    </div>
  );
};
```

### Making API Calls

```tsx
import { useSettingsStore } from '@/stores';

const useApi = () => {
  const { serverUrl } = useSettingsStore();

  const fetchData = async (endpoint: string) => {
    const response = await fetch(`${serverUrl}/api/${endpoint}`);
    return response.json();
  };

  return { fetchData };
};
```

### Accessing Settings Outside of React

```tsx
import { useSettingsStore } from '@/stores';

// Get the store without subscribing to updates
const settingsStore = useSettingsStore.getState();
const serverUrl = settingsStore.serverUrl;

// Update settings without React
useSettingsStore.getState().setServerUrl('https://api.example.com');
```

## Store Methods

### Getters
- `serverUrl`: Current server URL
- `darkMode`: Current dark mode state
- `notifications`: Current notifications state
- `autoSave`: Current auto-save state
- `language`: Current language setting

### Setters
- `setServerUrl(url: string)`: Update server URL
- `setDarkMode(enabled: boolean)`: Toggle dark mode
- `setNotifications(enabled: boolean)`: Toggle notifications
- `setAutoSave(enabled: boolean)`: Toggle auto-save
- `setLanguage(lang: string)`: Change language

## Persistence

Settings are automatically persisted to localStorage under the key `settings-storage`. The store will:

1. Load saved settings on app initialization
2. Save settings whenever they change
3. Fall back to defaults if no saved settings exist

## Best Practices

1. **Use the store in components** that need to display or modify settings
2. **Subscribe selectively** - only subscribe to settings you actually use
3. **Use the getState method** for one-time access outside of React
4. **Validate URLs** when setting the server URL
5. **Handle loading states** when the store is initializing

## Example: URL Validation

```tsx
import { useSettingsStore } from '@/stores';

const SettingsPage = () => {
  const { serverUrl, setServerUrl } = useSettingsStore();

  const handleServerUrlChange = (newUrl: string) => {
    try {
      new URL(newUrl); // Validate URL format
      setServerUrl(newUrl);
    } catch (error) {
      console.error('Invalid URL format');
    }
  };

  return (
    <input 
      value={serverUrl}
      onChange={(e) => handleServerUrlChange(e.target.value)}
      placeholder="http://localhost:3000"
    />
  );
};
```

