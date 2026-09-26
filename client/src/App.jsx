import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Discovery from './pages/Discovery';
import Explorer from './pages/Explorer';
import Ideation from './pages/Ideation';
import Verification from './pages/Verification';
import Drafting from './pages/Drafting';
import Layout from './layouts/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="discover" element={<Discovery />} />
          <Route path="explore" element={<Explorer />} />
          <Route path="ideation" element={<Ideation />} />
          <Route path="verification" element={<Verification />} />
          <Route path="drafting" element={<Drafting />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
