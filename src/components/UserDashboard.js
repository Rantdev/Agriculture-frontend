import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Mail, Calendar, Loader } from 'lucide-react';
import '../styles/Dashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

  useEffect(() => {
    // Get user from localStorage or fetch from backend
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/auth');
      return;
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
      return;
    }

    // Fetch current user from backend
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/auth');
            return;
          }
          throw new Error('Failed to fetch user');
        }

        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Loader size={48} className="spin" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>Error: {error}</p>
        <button onClick={handleLogout} className="btn btn-primary">Back to Login</button>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>👋 Welcome, {user?.username}!</h1>
          <p>Your farming dashboard awaits</p>
        </div>
        <button onClick={handleLogout} className="btn btn-logout">
          <LogOut size={20} />
          Logout
        </button>
      </div>

      <div className="dashboard-container">
        <div className="user-profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <User size={64} />
            </div>
            <div className="profile-info">
              <h2>Your Profile</h2>
              <p>Manage your account information</p>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <div className="detail-icon">
                <User size={24} />
              </div>
              <div className="detail-content">
                <label>Username</label>
                <p>{user?.username}</p>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <Mail size={24} />
              </div>
              <div className="detail-content">
                <label>Email Address</label>
                <p>{user?.email}</p>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <Calendar size={24} />
              </div>
              <div className="detail-content">
                <label>Member Since</label>
                <p>{formatDate(user?.created_at)}</p>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn btn-secondary">Edit Profile</button>
            <button className="btn btn-outline">Change Password</button>
          </div>
        </div>

        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <p className="stat-label">Crops Tracked</p>
              <p className="stat-value">0</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🌾</div>
            <div className="stat-content">
              <p className="stat-label">Fields</p>
              <p className="stat-value">0</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <p className="stat-label">Yield Predictions</p>
              <p className="stat-value">0</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <p className="stat-label">AI Recommendations</p>
              <p className="stat-value">0</p>
            </div>
          </div>
        </div>

        <div className="dashboard-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button className="btn btn-primary">
              <span>📝</span> Add New Crop
            </button>
            <button className="btn btn-primary">
              <span>🌍</span> View Crop Database
            </button>
            <button className="btn btn-primary">
              <span>📊</span> Yield Prediction
            </button>
            <button className="btn btn-primary">
              <span>🤖</span> Get AI Recommendations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
