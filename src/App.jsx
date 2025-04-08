import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import SearchResultsPage from "./components/search/SearchResultsPage";
import AdhyayaReader from "./components/pages/AdhyayaReader";
import { AppProvider } from "./context/AppContext"; // Import our context provider

function App() {
  return (
    // Wrap the entire application with AppProvider to make context available everywhere
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/read/:khanda/:adhyaya" element={<AdhyayaReader />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
