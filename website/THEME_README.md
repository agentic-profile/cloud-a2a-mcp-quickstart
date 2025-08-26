# Theme System Documentation

## Overview

This React application includes a comprehensive light/dark theme system with the following features:

- **Automatic Theme Detection**: Detects user's system preference on first visit
- **Persistent Storage**: Remembers user's theme choice across browser sessions
- **Smooth Transitions**: Beautiful animations when switching between themes
- **Accessible Toggle**: Sun/moon icon button in the top right corner
- **Responsive Design**: Works seamlessly across all device sizes

## How It Works

### Theme Context (`src/contexts/ThemeContext.tsx`)
- Manages theme state using React Context
- Automatically detects system color scheme preference
- Persists theme choice in localStorage
- Applies theme classes to the document root element

### Theme Toggle Component (`src/components/ThemeToggle.tsx`)
- Displays sun icon for light theme, moon icon for dark theme
- Handles theme switching with smooth transitions
- Includes proper accessibility attributes
- Positioned in the top right corner of the header

### Theme-Aware Styling
- Uses Tailwind CSS `dark:` prefix for theme-specific styles
- Smooth transitions for all color changes
- Consistent color palette across both themes
- Responsive design that works in both themes

## Usage

### For Users
1. **Toggle Theme**: Click the sun/moon icon in the top right corner
2. **Automatic Detection**: Your system preference is detected on first visit
3. **Persistent Choice**: Your theme choice is remembered across sessions

### For Developers
1. **Adding Theme Support**: Use `dark:` prefix with Tailwind classes
2. **Theme Context**: Import and use `useTheme()` hook in components
3. **Custom Colors**: Follow the established color palette patterns

## Color Palette

### Light Theme
- Background: `from-slate-50 via-purple-50 to-slate-50`
- Text: `text-gray-900`
- Cards: `bg-white border-gray-200`
- Accents: `text-purple-600`

### Dark Theme
- Background: `from-slate-900 via-purple-900 to-slate-900`
- Text: `text-white`
- Cards: `bg-gray-800 border-gray-700`
- Accents: `text-purple-400`

## Technical Implementation

### Dependencies
- React Context API for state management
- Tailwind CSS for styling with dark mode support
- Heroicons for theme toggle icons
- localStorage for persistence

### CSS Classes
- `dark:` prefix for dark theme styles
- `transition-colors duration-300` for smooth animations
- Responsive design with `md:` breakpoints

### File Structure
```
src/
├── contexts/
│   └── ThemeContext.tsx      # Theme state management
├── components/
│   └── ThemeToggle.tsx       # Theme toggle button
├── App.tsx                   # Main app with theme-aware styling
├── main.tsx                  # App wrapped with ThemeProvider
└── index.css                 # Base theme styles and transitions
```

## Browser Support

- Modern browsers with CSS custom properties support
- Automatic fallback to system preference
- Graceful degradation for older browsers

## Accessibility

- Proper ARIA labels for theme toggle
- High contrast ratios in both themes
- Keyboard navigation support
- Screen reader friendly

## Future Enhancements

- Additional theme options (auto, custom)
- Theme-specific animations
- User preference API integration
- Advanced color customization
