# Common Components

This directory contains reusable components that are used across different pages of the application.

## GlobalHeader Component

The `GlobalHeader` component provides a consistent navigation experience across the application with the following features:

- Site logo that links to the home page
- Main navigation menu with links to:
  - Home
  - Browse Khaandas (dropdown menu with all available khandas)
  - Read
  - Tags
- Search functionality with:
  - Quick search via SearchAutocomplete
  - Link to advanced search options

### Usage

```jsx
import GlobalHeader from './components/common/GlobalHeader';

// In your component or App.jsx
return (
  <div>
    <GlobalHeader />
    {/* Rest of your application */}
  </div>
);
```

## SearchAutocomplete Component

The `SearchAutocomplete` component provides an enhanced search input with suggestions fetched from the API as the user types.

### Props

- `initialValue` (string): Initial value for the search input
- `onSearch` (function): Callback function when search is executed
- `placeholder` (string): Placeholder text for the input
- `suggestionsLimit` (number): Maximum number of suggestions to show
- `className` (string): Additional CSS classes to apply to the component