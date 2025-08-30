# Spinner Component

A React component that wraps the HeroUI Spinner with consistent styling and simplified props.

## Features

- **HeroUI Integration**: Built on top of the HeroUI Spinner component
- **Consistent Styling**: Follows the design system patterns
- **Flexible Sizing**: Multiple size options for different contexts
- **Color Variants**: Various color options for different use cases
- **Accessibility**: Supports labels for screen readers

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `size` | `"sm" \| "md" \| "lg"` | No | `"md"` | Size of the spinner |
| `color` | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | No | `"default"` | Color theme of the spinner |
| `className` | `string` | No | `""` | Additional CSS classes |
| `label` | `string` | No | `undefined` | Accessible label for screen readers |

## Usage

### Basic Usage

```tsx
import { Spinner } from '@/components';

<Spinner />
```

### With Custom Size

```tsx
<Spinner size="lg" />
<Spinner size="sm" />
```

### With Custom Color

```tsx
<Spinner color="primary" />
<Spinner color="success" />
<Spinner color="warning" />
<Spinner color="danger" />
```

### With Custom Styling

```tsx
<Spinner className="my-custom-class" />
```

### With Label

```tsx
<Spinner label="Loading data..." />
```

### In Loading States

```tsx
{isLoading && (
    <div className="text-center">
        <Spinner size="md" color="primary" />
        <p className="mt-2 text-gray-600">Loading...</p>
    </div>
)}
```

## Size Options

- **`sm`**: Small spinner for inline use
- **`md`**: Medium spinner for general loading states
- **`lg`**: Large spinner for prominent loading displays

## Color Options

- **`default`**: Neutral gray color
- **`primary`**: Primary brand color (blue)
- **`secondary`**: Secondary color
- **`success`**: Green color for success states
- **`warning`**: Yellow/orange color for warning states
- **`danger`**: Red color for error states

## Examples

### Button Loading State

```tsx
<Button disabled={isLoading}>
    {isLoading ? (
        <>
            <Spinner size="sm" color="default" />
            <span className="ml-2">Loading...</span>
        </>
    ) : (
        'Submit'
    )}
</Button>
```

### Page Loading

```tsx
{isLoading ? (
    <div className="flex items-center justify-center min-h-[200px]">
        <Spinner size="lg" color="primary" label="Loading page content" />
    </div>
) : (
    <PageContent />
)}
```

### Inline Loading

```tsx
<div className="flex items-center space-x-2">
    <span>Processing...</span>
    <Spinner size="sm" />
</div>
```

## Integration

The component integrates seamlessly with:
- HeroUI design system
- Existing component patterns
- Theme switching systems
- Accessibility requirements

## Accessibility

- Supports `label` prop for screen readers
- Inherits HeroUI's accessibility features
- Proper ARIA attributes for loading states
- Keyboard navigation support

## Styling

- Uses HeroUI's built-in styling
- Consistent with design system
- Supports custom className overrides
- Responsive design patterns
