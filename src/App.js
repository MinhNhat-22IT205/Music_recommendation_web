import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RecommendResult from './pages/RecommendResult';
import SearchResult from './pages/SearchResult';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recommend" element={<RecommendResult />} />
        <Route path="/search" element={<SearchResult />} />
      </Routes>
    </Router>
  );
}