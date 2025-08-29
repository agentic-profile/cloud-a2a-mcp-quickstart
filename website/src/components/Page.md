# Page Component

The `Page` component is a reusable wrapper that provides consistent structure and styling for all pages in the application.

## Features

- **Consistent Layout**: Provides standardized header, container, and responsive layout
- **Flexible Configuration**: Customizable max-width, padding, and content areas
- **Dark Mode Support**: Automatically handles dark mode styling
- **Mobile Friendly**: Responsive design with optional mobile theme toggle
- **Accessible**: Built with accessibility best practices

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The main content of the page |
| `title` | `string` | - | Page title displayed in the header |
| `subtitle` | `string` | - | Page subtitle displayed below the title |
| `showMobileThemeToggle` | `boolean` | `false` | Show theme toggle button on mobile |
| `className` | `string` | `''` | Additional CSS classes |
| `maxWidth` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '4xl' \| '6xl' \| 'full'` | `'4xl'` | Maximum width of the page container |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'lg'` | Padding around the page content |
| `showHeader` | `boolean` | `true` | Whether to show the header section |
| `headerContent` | `React.ReactNode` | - | Custom header content (overrides title/subtitle) |
| `footerContent` | `React.ReactNode` | - | Optional footer content |

## Usage Examples

### Basic Page with Title and Subtitle
```tsx
import Page from '@/components/Page';

const MyPage = () => {
    return (
        <Page
            title="My Page"
            subtitle="This is a description of my page"
        >
            <div>Your page content here</div>
        </Page>
    );
};
```

### Page with Custom Width and No Header
```tsx
<Page
    maxWidth="6xl"
    showHeader={false}
    className="bg-gray-50"
>
    <div>Content without header</div>
</Page>
```

### Page with Custom Header Content
```tsx
<Page
    headerContent={
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Custom Header</h1>
            <button className="btn btn-primary">Action</button>
        </div>
    }
>
    <div>Content with custom header</div>
</Page>
```

### Page with Footer Content
```tsx
<Page
    title="My Page"
    footerContent={
        <div className="text-center text-sm text-gray-500">
            © 2025 My Company. All rights reserved.
        </div>
    }
>
    <div>Main content</div>
</Page>
```

### Page with Mobile Theme Toggle
```tsx
<Page
    title="My Page"
    showMobileThemeToggle={true}
>
    <div>Content with mobile theme toggle</div>
</Page>
```

## Best Practices

1. **Always use Page component** for new pages to maintain consistency
2. **Provide meaningful titles and subtitles** for better UX
3. **Choose appropriate maxWidth** based on content type:
   - `4xl` for most content pages
   - `6xl` for wide layouts (dashboards, tables)
   - `2xl` for forms or focused content
4. **Use headerContent** for complex headers with actions
5. **Use footerContent** for consistent footers across pages

## Responsive Behavior

- Automatically adjusts padding and spacing for different screen sizes
- Optional mobile theme toggle for better mobile UX
- Consistent breakpoints with the rest of the application
