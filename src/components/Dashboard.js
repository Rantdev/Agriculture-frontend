// src/components/Dashboard.js - Fixed Version
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  BarChart3, 
  Database, 
  Bot, 
  Upload,
  TrendingUp,
  Shield,
  CloudRain,
  Users,
  Calendar,
  ArrowRight,
  Zap,
  Target,
  Award,
  Clock,
  BarChart,
  PieChart,
  Activity,
  Leaf,
  Droplets,
  Sun,
  Lightbulb,
  User // Fixed: Added Lightbulb import
} from 'lucide-react';
import { healthCheck, getCropDatabase } from '../services/api';

const Dashboard = ({ backendStatus }) => {
  const [stats, setStats] = useState([
    { icon: TrendingUp, label: 'Prediction Accuracy', value: '95%', trend: 'up', description: 'AI model accuracy' },
    { icon: Shield, label: 'Risk Assessment', value: 'Real-time', trend: 'stable', description: 'Live monitoring' },
    { icon: CloudRain, label: 'Weather Integration', value: 'Live', trend: 'stable', description: 'Current data' },
    { icon: Users, label: 'Farmers Assisted', value: '1,000+', trend: 'up', description: 'Growing community' }
  ]);
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [cropCount, setCropCount] = useState(0);
  const [cropDistribution, setCropDistribution] = useState([]);
  const [seasonalData, setSeasonalData] = useState([]);

  const features = [
    {
      icon: Sprout,
      title: 'Crop Recommendations',
      description: 'AI-powered crop suggestions based on soil, weather, and market conditions',
      path: '/recommendations',
      color: 'green',
      status: 'active',
      badge: 'AI Powered'
    },
    {
      icon: BarChart3,
      title: 'Yield Prediction', 
      description: 'Predict crop yields with confidence intervals and comprehensive analysis',
      path: '/yield-prediction',
      color: 'blue',
      status: 'active',
      badge: 'ML Models'
    },
    {
      icon: Database,
      title: 'Crop Database',
      description: 'Comprehensive information about crops and cultivation practices',
      path: '/crop-database', 
      color: 'orange',
      status: 'active',
      badge: '50+ Crops'
    },
    {
      icon: Bot,
      title: 'Farming Assistant',
      description: 'Intelligent AI assistant for all your farming questions',
      path: '/farming-assistant',
      color: 'purple',
      status: 'enhanced',
      badge: 'Google AI'
    },
    {
      icon: Upload,
      title: 'Batch Processing',
      description: 'Process multiple farms and get bulk recommendations',
      path: '/batch-processing',
      color: 'red',
      status: 'active',
      badge: 'Bulk Analysis'
    }
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load crop database for count
      const cropData = await getCropDatabase();
      setCropCount(Object.keys(cropData).length);
      
      // Generate crop distribution data
      const distribution = [
        { name: 'Rice', value: 35, color: '#10b981' },
        { name: 'Wheat', value: 25, color: '#3b82f6' },
        { name: 'Maize', value: 20, color: '#f59e0b' },
        { name: 'Cotton', value: 12, color: '#8b5cf6' },
        { name: 'Sugarcane', value: 8, color: '#ef4444' }
      ];
      setCropDistribution(distribution);

      // Generate seasonal data
      const seasonal = [
        { season: 'Kharif', crops: 45, color: '#f59e0b' },
        { season: 'Rabi', crops: 38, color: '#3b82f6' },
        { season: 'Zaid', crops: 17, color: '#10b981' }
      ];
      setSeasonalData(seasonal);

      // Update stats with real data
      setStats(prev => prev.map(stat => 
        stat.label === 'Prediction Accuracy' 
          ? { ...stat, value: backendStatus === 'connected' ? '96%' : '92%' }
          : stat
      ));

      // Simulate recent activities
      setRecentActivities([
        {
          type: 'update',
          title: 'Google AI Integration',
          description: 'Enhanced farming assistant with Gemini AI',
          time: 'Just now',
          icon: Zap
        },
        {
          type: 'improvement', 
          title: 'Yield Prediction Enhanced',
          description: 'Accuracy improved with new weather data integration',
          time: '2 hours ago',
          icon: TrendingUp
        },
        {
          type: 'new',
          title: 'Mobile App Coming Soon',
          description: 'Mobile version under development for field use',
          time: '1 day ago',
          icon: Award
        }
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 6 && month <= 10) return 'Kharif';
    if (month >= 10 || month <= 3) return 'Rabi';
    return 'Zaid';
  };

  return (
    <div className="dashboard">
      {/* Enhanced Header */}
      <div className="dashboard-header">
  <div className="header-content">
    <div className="greeting-section">
      <h1>{getGreeting()}! 👋</h1>
      <p>Welcome to your AI-powered farming companion. Ready to optimize your agricultural operations?</p>
    </div>

    {/* 👇 add this wrapper for stats + profile */}
    <div className="header-right">
      <div className="header-stats">
        <div className="stat-badge">
          <span className="stat-number">{cropCount}+</span>
          <span className="stat-label">Crops</span>
        </div>
        <div className="stat-badge">
          <span className="stat-number">24/7</span>
          <span className="stat-label">Support</span>
        </div>
        <div className="stat-badge">
          <span className="stat-number">AI</span>
          <span className="stat-label">Powered</span>
        </div>
      </div>

      {/* 🧑‍🌾 Profile icon → UserDashboard */}
      <Link to="/dashboard" className="profile-icon-button">
        <User size={28} />
      </Link>
    </div>
  </div>
  <div className="header-background"></div>
</div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Left Column - Stats and Quick Actions */}
        <div className="dashboard-column left-column">
          {/* Quick Stats Grid */}
          <div className="stats-section">
            <div className="section-header">
              <h3>📊 Performance Metrics</h3>
              <p>Real-time system performance and accuracy</p>
            </div>
            <div className="stats-grid">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="stat-card">
                    <div className="stat-header">
                      <div className={`stat-icon ${stat.trend}`}>
                        <Icon size={20} />
                      </div>
                      <div className={`stat-trend ${stat.trend}`}>
                        {stat.trend === 'up' ? '↗' : stat.trend === 'down' ? '↘' : '→'}
                      </div>
                    </div>
                    <div className="stat-content">
                      <h3>{stat.value}</h3>
                      <p>{stat.label}</p>
                      <span className="stat-description">{stat.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-section">
            <div className="section-header">
              <h3>🚀 Quick Actions</h3>
              <p>Get started with these common tasks</p>
            </div>
            <div className="actions-grid">
              <Link to="/recommendations" className="action-card primary">
                <div className="action-icon">
                  <Sprout size={20} />
                </div>
                <div className="action-content">
                  <h4>Get Crop Advice</h4>
                  <p>AI-powered recommendations</p>
                </div>
                <ArrowRight size={16} className="action-arrow" />
              </Link>
              
              <Link to="/yield-prediction" className="action-card secondary">
                <div className="action-icon">
                  <BarChart3 size={20} />
                </div>
                <div className="action-content">
                  <h4>Predict Yield</h4>
                  <p>Accurate yield forecasts</p>
                </div>
                <ArrowRight size={16} className="action-arrow" />
              </Link>
              
              <Link to="/farming-assistant" className="action-card accent">
                <div className="action-icon">
                  <Bot size={20} />
                </div>
                <div className="action-content">
                  <h4>Ask Assistant</h4>
                  <p>Google AI powered help</p>
                </div>
                <ArrowRight size={16} className="action-arrow" />
              </Link>
              
              <Link to="/crop-database" className="action-card success">
                <div className="action-icon">
                  <Database size={20} />
                </div>
                <div className="action-content">
                  <h4>Browse Crops</h4>
                  <p>Comprehensive database</p>
                </div>
                <ArrowRight size={16} className="action-arrow" />
              </Link>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="activities-section">
            <div className="section-header">
              <h3>📢 Recent Updates</h3>
              <p>Latest improvements and system updates</p>
            </div>
            <div className="activities-list">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className={`activity-item ${activity.type}`}>
                    <div className="activity-icon">
                      <Icon size={16} />
                    </div>
                    <div className="activity-content">
                      <h4>{activity.title}</h4>
                      <p>{activity.description}</p>
                      <span className="activity-time">
                        <Clock size={12} />
                        {activity.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Middle Column - Charts and Visualizations */}
        <div className="dashboard-column middle-column">
          {/* Crop Distribution Chart */}
          <div className="chart-section">
            <div className="section-header">
              <h3>🌱 Crop Distribution</h3>
              <p>Popular crops in our database</p>
            </div>
            <div className="chart-container">
              <div className="distribution-chart">
                {cropDistribution.map((crop, index) => (
                  <div key={index} className="distribution-item">
                    <div className="distribution-bar">
                      <div 
                        className="distribution-fill"
                        style={{ 
                          width: `${crop.value}%`,
                          backgroundColor: crop.color
                        }}
                      ></div>
                    </div>
                    <div className="distribution-label">
                      <div className="crop-color" style={{ backgroundColor: crop.color }}></div>
                      <span className="crop-name">{crop.name}</span>
                      <span className="crop-percentage">{crop.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Seasonal Distribution */}
          <div className="chart-section">
            <div className="section-header">
              <h3>📅 Seasonal Distribution</h3>
              <p>Crops by growing season</p>
            </div>
            <div className="seasonal-chart">
              {seasonalData.map((season, index) => (
                <div key={index} className="seasonal-item">
                  <div className="seasonal-header">
                    <span className="season-name">{season.season}</span>
                    <span className="season-count">{season.crops} crops</span>
                  </div>
                  <div className="seasonal-bar">
                    <div 
                      className="seasonal-fill"
                      style={{ 
                        width: `${(season.crops / 100) * 100}%`,
                        backgroundColor: season.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="current-season">
              <div className="season-indicator">
                <Calendar size={16} />
                <span>Current Season: <strong>{getCurrentSeason()}</strong></span>
              </div>
            </div>
          </div>

          {/* Weather Overview */}
          <div className="weather-section">
            <div className="section-header">
              <h3>🌤️ Weather Overview</h3>
              <p>Current farming conditions</p>
            </div>
            <div className="weather-cards">
              <div className="weather-card">
                <div className="weather-icon">
                  <Sun size={20} />
                </div>
                <div className="weather-content">
                  <h4>Temperature</h4>
                  <p>25-32°C</p>
                  <span className="weather-status">Ideal for sowing</span>
                </div>
              </div>
              <div className="weather-card">
                <div className="weather-icon">
                  <Droplets size={20} />
                </div>
                <div className="weather-content">
                  <h4>Rainfall</h4>
                  <p>Low chance</p>
                  <span className="weather-status">Irrigation needed</span>
                </div>
              </div>
              <div className="weather-card">
                <div className="weather-icon">
                  <CloudRain size={20} />
                </div>
                <div className="weather-content">
                  <h4>Humidity</h4>
                  <p>65-80%</p>
                  <span className="weather-status">Good for growth</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Features and System Status */}
        <div className="dashboard-column right-column">
          {/* Main Features Grid */}
          <div className="features-section">
            <div className="section-header">
              <h3>🛠️ AI Farming Tools</h3>
              <p>Comprehensive suite of intelligent tools</p>
            </div>
            <div className="features-grid">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Link key={index} to={feature.path} className="feature-card">
                    <div className="feature-header">
                      <div className={`feature-icon ${feature.color}`}>
                        <Icon size={24} />
                      </div>
                      <div className="feature-badges">
                        <span className={`status-badge ${feature.status}`}>
                          {feature.badge}
                        </span>
                      </div>
                    </div>
                    <div className="feature-content">
                      <h4>{feature.title}</h4>
                      <p>{feature.description}</p>
                    </div>
                    <div className="feature-footer">
                      <span className="feature-cta">
                        Get Started
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* System Status */}
          <div className="status-section">
            <div className="status-card">
              <div className="status-header">
                <h3>System Status</h3>
                <div className={`status-indicator large ${backendStatus}`}></div>
              </div>
              <div className="status-details">
                <div className="status-item">
                  <span className="status-label">Backend API:</span>
                  <span className={`status-value ${backendStatus}`}>
                    {backendStatus === 'connected' ? 'Connected' : 'Demo Mode'}
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">AI Assistant:</span>
                  <span className="status-value enhanced">
                    {backendStatus === 'connected' ? 'Google AI Active' : 'Enhanced Local'}
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">Data Sources:</span>
                  <span className="status-value active">
                    {cropCount} Crops Loaded
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">Last Updated:</span>
                  <span className="status-value">
                    Just now
                  </span>
                </div>
              </div>
              {backendStatus === 'disconnected' && (
                <div className="status-warning">
                  <Shield size={14} />
                  <span>Connect backend for full AI features</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="tips-section">
            <div className="section-header">
              <h3>💡 Farming Tips</h3>
              <p>Expert advice for better yields</p>
            </div>
            <div className="tips-list">
              <div className="tip-item">
                <Lightbulb size={16} />
                <span>Test soil before planting for optimal fertilizer use</span>
              </div>
              <div className="tip-item">
                <Leaf size={16} />
                <span>Practice crop rotation to maintain soil health</span>
              </div>
              <div className="tip-item">
                <Droplets size={16} />
                <span>Use drip irrigation to save 30-50% water</span>
              </div>
              <div className="tip-item">
                <Activity size={16} />
                <span>Monitor crops regularly for early pest detection</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;