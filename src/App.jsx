import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/home/HomePage";
import SearchResultsPage from "./components/search/SearchResultsPage";
import AdhyayaReader from "./components/reader/AdhyayaReader";
import GlobalHeader from "./components/common/GlobalHeader";
import { AppProvider } from "./context/AppContext"; // Import our context provider

function App() {
  return (
    // Wrap the entire application with AppProvider to make context available everywhere
    <AppProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <GlobalHeader />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/read/:khanda/:adhyaya" element={<AdhyayaReader />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
