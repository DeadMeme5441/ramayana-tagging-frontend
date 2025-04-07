import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import SearchResultsPage from "./components/pages/SearchResultsPage";
import AdhyayaReader from "./components/pages/AdhyayaReader";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/read/:khanda/:adhyaya" element={<AdhyayaReader />} />
      </Routes>
    </Router>
  );
}

export default App;
