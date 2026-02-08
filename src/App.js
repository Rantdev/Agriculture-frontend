// src/App.js
// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components (inside src/components)
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import CropRecommendation from './components/CropRecommendation';
import YieldPrediction from './components/YieldPrediction';
import CropDatabase from './components/CropDatabase';
import FarmingAssistant from './components/FarmingAssistant';
import BatchProcessing from './components/BatchProcessing';
import Auth from './components/Auth';
import UserDashboard from './components/UserDashboard';

// Services and styles (inside src/)
import { healthCheck } from './services/api';
import './styles/App.css';

function App() {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [loading, setLoading] = useState(true);

  // ✅ Read auth status from localStorage (persistent login)
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        setLoading(true);
        await healthCheck();
        setBackendStatus('connected');
      } catch (error) {
        setBackendStatus('disconnected');
        console.warn('Backend not connected:', error?.message || error);
      } finally {
        setLoading(false);
      }
    };

    // Check backend only once on app start
    checkBackendConnection();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-icon">🌾</div>
          <h1>Smart Agriculture Advisor</h1>
          <p>Initializing application...</p>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  // helper for protecting routes
  const requireAuth = (element) =>
    isAuthenticated ? element : <Navigate to="/auth" replace />;

  // when user logs in successfully, update state
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  // optional logout handler, if you call it from Navigation or Dashboard
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        {/* Show Navigation only when authenticated */}
        {isAuthenticated && (
          <Navigation
            backendStatus={backendStatus}
            onLogout={handleLogout} // if you want logout button there
          />
        )}

        <div className="main-content">
          <Routes>
            {/* LOGIN PAGE */}
            <Route
              path="/auth"
              element={
                isAuthenticated ? (
                  // already logged in → go to dashboard
                  <Navigate to="/dashboard" replace />
                ) : (
                  // not logged in → show Auth
                  <Auth onLoginSuccess={handleLoginSuccess} />
                )
              }
            />

            {/* MAIN USER DASHBOARD AFTER LOGIN */}
            <Route
              path="/dashboard"
              element={requireAuth(
                <UserDashboard backendStatus={backendStatus} />
              )}
            />

            {/* OPTIONAL main / overview dashboard on "/" */}
            <Route
              path="/"
              element={requireAuth(
                <Dashboard backendStatus={backendStatus} />
              )}
            />

            {/* PROTECTED FEATURE ROUTES */}
            <Route
              path="/recommendations"
              element={requireAuth(
                <CropRecommendation backendStatus={backendStatus} />
              )}
            />

            <Route
              path="/yield-prediction"
              element={requireAuth(
                <YieldPrediction backendStatus={backendStatus} />
              )}
            />

            <Route
              path="/crop-database"
              element={requireAuth(<CropDatabase />)}
            />

            <Route
              path="/farming-assistant"
              element={requireAuth(
                <FarmingAssistant backendStatus={backendStatus} />
              )}
            />

            <Route
              path="/batch-processing"
              element={requireAuth(
                <BatchProcessing backendStatus={backendStatus} />
              )}
            />

            {/* UNKNOWN ROUTES → if logged in, go to dashboard, else login */}
            <Route
              path="*"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
