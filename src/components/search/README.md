# Search Components

This directory contains components related to the search functionality in the Ramayana Tagging Engine.

## SearchResultsPage Component

The main container component that handles search queries, filters, and results display.

### Features

- **Search Input**: Provides a search bar with autocomplete suggestions
- **Filtering**: Allows filtering by Khanda, Adhyaya, and Semantic Category
- **Results Display**: Shows search results with collapsible content
- **Pagination**: Supports "load more" functionality for viewing additional results

### Component Structure

The SearchResultsPage is composed of several modular components:
- `SearchBar`: Input field with autocomplete for entering search queries
- `RefineFilters`: Filter options for narrowing down search results
- `SearchResults`: Container for displaying the list of search results
- `SearchResultItem`: Individual search result with collapsible content
- `EmptySearchState`: Initial state with suggestions when no search has been performed

### State Management

- Uses the AppContext for managing search state across the application
- Handles local state for search queries, filters, and results
- Syncs URL parameters with search state for bookmarkable searches
- Manages loading and error states for search operations

## SearchBar Component

Provides a search input with autocomplete functionality.

### Props

- `initialQuery`: The initial search term to display
- `onSearch`: Callback function for when search is performed

## RefineFilters Component

Displays filters for refining search results.

### Features

- Filter by Khanda (book section)
- Filter by Adhyaya (chapter)
- Filter by Main Topic (semantic category)
- Support for clearing all filters
- Responsive design with accordion menu on mobile

## SearchResults Component

Displays the list of search results.

### Props

- `results`: The search results data
- `onLoadMore`: Callback for loading more results

## SearchResultItem Component

Displays an individual search result with collapsible content.

### Features

- Displays tag name and subject information
- Shows matches with context
- Highlights matched text
- Collapsible content with toggle button
- Navigation to the full context in the reader

### Props

- `result`: The search result data object

## Usage Example

```jsx
// In a router configuration
<Route path="/search" element={<SearchResultsPage />} />

// In AppContext.jsx or similar
const handleSearch = (query, filters) => {
  navigate(`/search?q=${query}`);
};
```

## API Integration

The search components integrate with the following API endpoints via the services/api.js module:
- `searchTags`: Performs the search with filters
- `fetchMainTopics`: Retrieves available main topics for filtering
- `fetchKhandasStructure`: Gets the structure of Khandas and Adhyayas for filtering