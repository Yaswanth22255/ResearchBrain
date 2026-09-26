import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public & Auth Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import NotFound from './pages/NotFound';

// Protected Workspace Pages
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Discovery from './pages/Discovery';
import Explorer from './pages/Explorer';
import Ideation from './pages/Ideation';
import Verification from './pages/Verification';
import Drafting from './pages/Drafting';
import BrainStorm from './pages/BrainStorm';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Application Workspace */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="discover" element={<Discovery />} />
            <Route path="explore" element={<Explorer />} />
            <Route path="brainstorm" element={<BrainStorm />} />
            <Route path="ideation" element={<Ideation />} />
            <Route path="verification" element={<Verification />} />
            <Route path="drafting" element={<Drafting />} />
          </Route>

          {/* 404 Catch-All Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
