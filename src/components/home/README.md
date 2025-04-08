# Home Components

This directory contains components used in the home page of the Ramayana Tagging Engine.

## Overview

The Home components provide a structured and modular approach to building the main landing page of the application. Each component handles a specific section of the homepage, making the code more maintainable and focused.

## HomePage Component

The main component that serves as the entry point for the application's home page. It combines all the section components into a cohesive layout.

### Features

- Manages loading and error states
- Organizes layout with responsive design
- Combines all section components
- Includes a footer with copyright and links

### Usage

```jsx
// In App.jsx
import HomePage from "./components/home/HomePage";

<Route path="/" element={<HomePage />} />
```

## HeroSection Component

The HeroSection component displays a prominent search bar and introduction to the application.

### Features

- Large, centered search bar with autocomplete
- Brief introduction text explaining the purpose of the application
- Gradient background for visual appeal

### Usage

```jsx
import HeroSection from './HeroSection';

// In your HomePage component
<HeroSection />
```

## KhaandasBrowser Component

This component displays a browsable list of Khaandas (books) from the Ramayana.

### Features

- Expandable list of Khaandas
- Shows the number of Adhyayas (chapters) and estimated tags for each Khaanda
- Clicking on a Khaanda shows a list of its Adhyayas
- Navigates to the reader component when an Adhyaya is selected

### Usage

```jsx
import KhaandasBrowser from './KhaandasBrowser';

// In your HomePage component
<KhaandasBrowser />
```

## SemanticsBreakdown Component

Displays semantic categories of tags in the Ramayana with examples.

### Features

- Shows popular semantic categories (tag types)
- Expandable list with tag examples for each category
- Limits to 5 examples per category with indication of more
- Provides navigation to search results for a specific category

### Usage

```jsx
import SemanticsBreakdown from './SemanticsBreakdown';

// In your HomePage component
<SemanticsBreakdown />
```

## TaggingExplanation Component

Explains the tagging system used in the Ramayana Tagging Engine.

### Features

- Tabbed interface with different aspects of the tagging system
- "About" tab explains the purpose of the tagging project
- "Structure" tab details the format and organization of tags
- "Examples" tab shows sample tags with explanations

### Usage

```jsx
import TaggingExplanation from './TaggingExplanation';

// In your HomePage component
<TaggingExplanation />
```

## Component Structure

The home page is organized in a specific layout:
1. **Hero Section**: Top section with search functionality
2. **Two-Column Layout**: 
   - Left column: KhaandasBrowser
   - Right column: SemanticsBreakdown
3. **Tagging Explanation**: Full-width section below
4. **Footer**: Application-wide footer

## Styling

All components follow a consistent color scheme using Tailwind CSS:
- Primary colors: orange, amber for backgrounds and accents
- Text colors: orange-900, orange-800 for readability
- Consistent rounded corners and spacing
- Responsive design that works on mobile and desktop devices