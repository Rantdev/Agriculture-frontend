// src/components/Navigation.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sprout, 
  BarChart3, 
  Database, 
  Bot, 
  Upload,
  Home,
  TrendingUp,
  CloudRain,
  Users
} from 'lucide-react';

const Navigation = ({ backendStatus }) => {
  const location = useLocation();

  const navItems = [
    { 
      id: 'dashboard', 
      path: '/', 
      icon: Home, 
      label: 'Dashboard',
      description: 'Overview and analytics'
    },
    { 
      id: 'recommendations', 
      path: '/recommendations', 
      icon: Sprout, 
      label: 'Crop Recommendations',
      description: 'AI-powered crop suggestions'
    },
    { 
      id: 'yield-prediction', 
      path: '/yield-prediction', 
      icon: BarChart3, 
      label: 'Yield Prediction',
      description: 'Predict crop yields'
    },
    { 
      id: 'crop-database', 
      path: '/crop-database', 
      icon: Database, 
      label: 'Crop Database',
      description: 'Comprehensive crop information'
    },
    { 
      id: 'farming-assistant', 
      path: '/farming-assistant', 
      icon: Bot, 
      label: 'Farming Assistant',
      description: 'AI farming guidance'
    },
    { 
      id: 'batch-processing', 
      path: '/batch-processing', 
      icon: Upload, 
      label: 'Batch Processing',
      description: 'Process multiple farms'
    },
  ];

  const quickStats = [
    { icon: TrendingUp, label: 'Prediction Accuracy', value: '95%' },
    { icon: CloudRain, label: 'Weather Integration', value: 'Live' },
    { icon: Users, label: 'Farmers Assisted', value: '1,000+' }
  ];

  return (
    <nav className="navbar">
      {/* Brand Header */}
      <div className="nav-brand">
        <div className="brand-logo">
          <Sprout size={32} />
        </div>
        <div className="brand-text">
          <h1>Smart Agriculture</h1>
          <p>AI-Powered Farming</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="nav-links">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <div className="nav-link-icon">
                <Icon size={20} />
              </div>
              <div className="nav-link-text">
                <span className="nav-link-label">{item.label}</span>
                <span className="nav-link-desc">{item.description}</span>
              </div>
              {isActive && <div className="nav-link-indicator"></div>}
            </Link>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="nav-stats">
        <h3>Quick Stats</h3>
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-item">
              <div className="stat-icon">
                <Icon size={16} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Backend Status */}
      <div className="nav-status">
        <div className={`connection-status ${backendStatus}`}>
          <div className="status-dot"></div>
          <span>Backend {backendStatus === 'connected' ? 'Connected' : 'Offline'}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;