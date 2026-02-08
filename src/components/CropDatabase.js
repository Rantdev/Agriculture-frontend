// src/components/CropDatabase.js - Modern Enhanced Version
import React, { useState, useEffect } from 'react';
import {
  Database,
  Search,
  Filter,
  TrendingUp,
  Droplets,
  Calendar,
  Shield,
  Sprout,
  BarChart3,
  Clock,
  Leaf,
  Sun,
  CloudRain,
  AlertTriangle,
  CheckCircle,
  X,
  Download,
  Share2,
  Bookmark,
  Star,
  Zap,
  Users,
  Target,
  ArrowRight,
  Heart,
  BookOpen,
  ChevronRight,
  Play
} from 'lucide-react';
import { getCropDatabase, getCropDetails } from '../services/api';

const CropDatabase = () => {
  const [crops, setCrops] = useState({});
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeason, setFilterSeason] = useState('All');
  const [filterWater, setFilterWater] = useState('All');
  const [filterProfitability, setFilterProfitability] = useState('All');
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid');
  const [activeTab, setActiveTab] = useState('overview');

  const seasons = ['All', 'Kharif', 'Rabi', 'Zaid', 'Throughout Year'];
  const waterNeeds = ['All', 'Low', 'Medium', 'High', 'Very High'];
  const profitabilityLevels = ['All', 'Low', 'Medium', 'High', 'Very High'];

  // Enhanced crop data with more details
  const cropCategories = {
    'Grains': ['Rice', 'Wheat', 'Maize'],
    'Cash Crops': ['Cotton', 'Sugarcane'],
    'Pulses': [],
    'Vegetables': [],
    'Fruits': []
  };

  useEffect(() => {
    loadCropDatabase();
    const savedFavorites = localStorage.getItem('cropFavorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  const loadCropDatabase = async () => {
    setLoading(true);
    try {
      const cropData = await getCropDatabase();
      setCrops(cropData);
      const firstCrop = Object.keys(cropData)[0];
      if (firstCrop) {
        handleCropSelect(firstCrop);
      }
    } catch (error) {
      console.error('Error loading crop database:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCropSelect = async (cropName) => {
    setLoading(true);
    try {
      const cropDetails = await getCropDetails(cropName);
      setSelectedCrop({ ...cropDetails, name: cropName });
      setActiveTab('overview');
    } catch (error) {
      console.error('Error loading crop details:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (cropName) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(cropName)) {
      newFavorites.delete(cropName);
    } else {
      newFavorites.add(cropName);
    }
    setFavorites(newFavorites);
    localStorage.setItem('cropFavorites', JSON.stringify([...newFavorites]));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterSeason('All');
    setFilterWater('All');
    setFilterProfitability('All');
  };

  const filteredCrops = Object.entries(crops).filter(([cropName, cropData]) => {
    const matchesSearch = cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cropData.special_notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cropData.ideal_soil?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeason = filterSeason === 'All' || cropData.season === filterSeason;
    const matchesWater = filterWater === 'All' || cropData.water_need === filterWater;
    const matchesProfitability = filterProfitability === 'All' || cropData.profitability === filterProfitability;
    
    return matchesSearch && matchesSeason && matchesWater && matchesProfitability;
  });

  // Enhanced color system
  const getProfitabilityColor = (profitability) => {
    const colors = {
      'Low': 'linear-gradient(135deg, #ef4444, #dc2626)',
      'Medium': 'linear-gradient(135deg, #f59e0b, #d97706)',
      'High': 'linear-gradient(135deg, #10b981, #059669)',
      'Very High': 'linear-gradient(135deg, #059669, #047857)'
    };
    return colors[profitability] || 'linear-gradient(135deg, #6b7280, #4b5563)';
  };

  const getRiskColor = (risk) => {
    const colors = {
      'Low': 'linear-gradient(135deg, #10b981, #059669)',
      'Medium': 'linear-gradient(135deg, #f59e0b, #d97706)',
      'High': 'linear-gradient(135deg, #ef4444, #dc2626)',
      'Very High': 'linear-gradient(135deg, #dc2626, #b91c1c)'
    };
    return colors[risk] || 'linear-gradient(135deg, #6b7280, #4b5563)';
  };

  const getWaterNeedColor = (waterNeed) => {
    const colors = {
      'Low': 'linear-gradient(135deg, #60a5fa, #3b82f6)',
      'Medium': 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      'High': 'linear-gradient(135deg, #1d4ed8, #1e40af)',
      'Very High': 'linear-gradient(135deg, #1e40af, #1e3a8a)'
    };
    return colors[waterNeed] || 'linear-gradient(135deg, #6b7280, #4b5563)';
  };

  const getSeasonColor = (season) => {
    const colors = {
      'Kharif': 'linear-gradient(135deg, #f59e0b, #d97706)',
      'Rabi': 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      'Zaid': 'linear-gradient(135deg, #10b981, #059669)',
      'Throughout Year': 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
    };
    return colors[season] || 'linear-gradient(135deg, #6b7280, #4b5563)';
  };

  const CropDetailTabs = ({ crop }) => (
    <div className="detail-tabs">
      <button 
        className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
        onClick={() => setActiveTab('overview')}
      >
        <BookOpen size={16} />
        Overview
      </button>
      <button 
        className={`tab ${activeTab === 'cultivation' ? 'active' : ''}`}
        onClick={() => setActiveTab('cultivation')}
      >
        <Sprout size={16} />
        Cultivation
      </button>
      <button 
        className={`tab ${activeTab === 'economics' ? 'active' : ''}`}
        onClick={() => setActiveTab('economics')}
      >
        <TrendingUp size={16} />
        Economics
      </button>
      <button 
        className={`tab ${activeTab === 'insights' ? 'active' : ''}`}
        onClick={() => setActiveTab('insights')}
      >
        <Zap size={16} />
        AI Insights
      </button>
    </div>
  );

  const OverviewTab = ({ crop }) => (
    <div className="tab-content">
      <div className="metrics-grid">
        <div className="metric-card large">
          <div className="metric-header">
            <div className="metric-icon">
              <TrendingUp size={24} />
            </div>
            <div className="metric-info">
              <h4>Profit Potential</h4>
              <div 
                className="profit-badge"
                style={{ background: getProfitabilityColor(crop.profitability) }}
              >
                {crop.profitability}
              </div>
            </div>
          </div>
          <p>This crop has {crop.profitability.toLowerCase()} profitability based on current market trends and input costs.</p>
        </div>

        <div className="metric-card large">
          <div className="metric-header">
            <div className="metric-icon">
              <Shield size={24} />
            </div>
            <div className="metric-info">
              <h4>Risk Assessment</h4>
              <div 
                className="risk-badge"
                style={{ background: getRiskColor(crop.risk) }}
              >
                {crop.risk} Risk
              </div>
            </div>
          </div>
          <p>{crop.risk} risk level indicates {crop.risk.toLowerCase() === 'low' ? 'stable' : 'variable'} cultivation conditions.</p>
        </div>
      </div>

      <div className="quick-stats">
        <h4>Key Statistics</h4>
        <div className="stats-grid">
          <div className="stat">
            <div className="stat-value">{crop.duration}</div>
            <div className="stat-label">Growth Period</div>
          </div>
          <div className="stat">
            <div className="stat-value">{crop.water_need}</div>
            <div className="stat-label">Water Need</div>
          </div>
          <div className="stat">
            <div className="stat-value">{crop.market_demand}</div>
            <div className="stat-label">Market Demand</div>
          </div>
        </div>
      </div>
    </div>
  );

  const CultivationTab = ({ crop }) => (
    <div className="tab-content">
      <div className="cultivation-guide">
        <h4>🌱 Cultivation Guide</h4>
        <div className="guide-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h5>Soil Preparation</h5>
              <p>Ideal soil type: <strong>{crop.ideal_soil}</strong>. Prepare field with proper plowing and leveling.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h5>Planting Season</h5>
              <p>Best grown in <strong>{crop.season}</strong> season. Follow regional planting calendars.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h5>Water Management</h5>
              <p><strong>{crop.water_need}</strong> water requirement. Implement efficient irrigation practices.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const EconomicsTab = ({ crop }) => (
    <div className="tab-content">
      <div className="economics-analysis">
        <h4>💰 Economic Analysis</h4>
        <div className="analysis-cards">
          <div className="analysis-card">
            <div className="analysis-icon profit">
              <TrendingUp size={20} />
            </div>
            <div className="analysis-content">
              <h5>Profitability</h5>
              <div className="analysis-value">{crop.profitability}</div>
              <p>Based on input costs and market prices</p>
            </div>
          </div>
          <div className="analysis-card">
            <div className="analysis-icon market">
              <Users size={20} />
            </div>
            <div className="analysis-content">
              <h5>Market Demand</h5>
              <div className="analysis-value">{crop.market_demand}</div>
              <p>Current consumer demand trend</p>
            </div>
          </div>
          <div className="analysis-card">
            <div className="analysis-icon risk">
              <Shield size={20} />
            </div>
            <div className="analysis-content">
              <h5>Risk Level</h5>
              <div className="analysis-value">{crop.risk}</div>
              <p>Price volatility and crop risks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const InsightsTab = ({ crop }) => (
    <div className="tab-content">
      <div className="ai-insights">
        <h4>🤖 AI-Powered Insights</h4>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-header">
              <Zap size={20} />
              <h5>Smart Recommendation</h5>
            </div>
            <p>{crop.special_notes}</p>
          </div>
          <div className="insight-card">
            <div className="insight-header">
              <Target size={20} />
              <h5>Optimization Tips</h5>
            </div>
            <p>Consider crop rotation and integrated pest management for better yield and soil health.</p>
          </div>
          <div className="insight-card">
            <div className="insight-header">
              <CloudRain size={20} />
              <h5>Climate Adaptation</h5>
            </div>
            <p>This crop shows good resilience to moderate climate variations in its preferred season.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    if (!selectedCrop) return null;
    
    switch (activeTab) {
      case 'overview':
        return <OverviewTab crop={selectedCrop} />;
      case 'cultivation':
        return <CultivationTab crop={selectedCrop} />;
      case 'economics':
        return <EconomicsTab crop={selectedCrop} />;
      case 'insights':
        return <InsightsTab crop={selectedCrop} />;
      default:
        return <OverviewTab crop={selectedCrop} />;
    }
  };

  return (
    <div className="crop-database-modern">
      {/* Enhanced Header */}
      <div className="modern-header">
        <div className="header-background"></div>
        <div className="header-content">
          <div className="header-main">
            <div className="header-icon">
              <Database size={40} />
            </div>
            <div className="header-text">
              <h1>🌱 Smart Crop Database</h1>
              <p>AI-powered insights for smarter farming decisions</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat">
              <div className="stat-number">{Object.keys(crops).length}+</div>
              <div className="stat-label">Crops</div>
            </div>
            <div className="stat">
              <div className="stat-number">{favorites.size}</div>
              <div className="stat-label">Favorites</div>
            </div>
            <div className="stat">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Updated</div>
            </div>
          </div>
        </div>
      </div>

      <div className="database-container-modern">
        {/* Enhanced Sidebar */}
        <div className="modern-sidebar">
          <div className="sidebar-header">
            <div className="search-section">
              <div className="search-box-modern">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search crops, soil, techniques..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button className="clear-search" onClick={() => setSearchTerm('')}>
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="filters-section">
              <div className="filters-header">
                <Filter size={18} />
                <span>Smart Filters</span>
                {(filterSeason !== 'All' || filterWater !== 'All' || filterProfitability !== 'All') && (
                  <button className="clear-filters" onClick={clearFilters}>
                    Clear all
                  </button>
                )}
              </div>

              <div className="filter-tags">
                <select 
                  className="filter-tag"
                  value={filterSeason} 
                  onChange={(e) => setFilterSeason(e.target.value)}
                  style={{ background: filterSeason !== 'All' ? getSeasonColor(filterSeason) : '' }}
                >
                  <option value="All">🌾 Any Season</option>
                  {seasons.filter(s => s !== 'All').map(season => (
                    <option key={season} value={season}>{season}</option>
                  ))}
                </select>

                <select 
                  className="filter-tag"
                  value={filterWater} 
                  onChange={(e) => setFilterWater(e.target.value)}
                  style={{ background: filterWater !== 'All' ? getWaterNeedColor(filterWater) : '' }}
                >
                  <option value="All">💧 Any Water</option>
                  {waterNeeds.filter(w => w !== 'All').map(water => (
                    <option key={water} value={water}>{water}</option>
                  ))}
                </select>

                <select 
                  className="filter-tag"
                  value={filterProfitability} 
                  onChange={(e) => setFilterProfitability(e.target.value)}
                  style={{ background: filterProfitability !== 'All' ? getProfitabilityColor(filterProfitability) : '' }}
                >
                  <option value="All">💰 Any Profit</option>
                  {profitabilityLevels.filter(p => p !== 'All').map(profit => (
                    <option key={profit} value={profit}>{profit}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Enhanced Crop List */}
          <div className="crop-list-modern">
            <div className="list-header">
              <h4>Crop Directory</h4>
              <div className="view-controls">
                <span>{filteredCrops.length} crops</span>
                <div className="view-buttons">
                  <button 
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    ▦
                  </button>
                  <button 
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    ≡
                  </button>
                </div>
              </div>
            </div>

            <div className={`crops-container ${viewMode}`}>
              {loading ? (
                <div className="loading-crops">
                  <div className="loading-spinner"></div>
                  <span>Loading crops...</span>
                </div>
              ) : filteredCrops.length === 0 ? (
                <div className="no-crops-found">
                  <Search size={48} />
                  <h4>No matching crops</h4>
                  <p>Try different search terms or filters</p>
                </div>
              ) : (
                filteredCrops.map(([cropName, cropData]) => (
                  <div
                    key={cropName}
                    className={`crop-card ${selectedCrop?.name === cropName ? 'active' : ''} ${favorites.has(cropName) ? 'favorite' : ''}`}
                    onClick={() => handleCropSelect(cropName)}
                  >
                    <div className="crop-card-header">
                      <div className="crop-icon">
                        <Sprout size={24} />
                      </div>
                      <div className="crop-title">
                        <h4>{cropName}</h4>
                        <button 
                          className={`favorite-btn ${favorites.has(cropName) ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(cropName);
                          }}
                        >
                          <Heart size={16} fill={favorites.has(cropName) ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>

                    <div className="crop-meta">
                      <span 
                        className="meta-tag season"
                        style={{ background: getSeasonColor(cropData.season) }}
                      >
                        <Calendar size={12} />
                        {cropData.season}
                      </span>
                      <span 
                        className="meta-tag water"
                        style={{ background: getWaterNeedColor(cropData.water_need) }}
                      >
                        <Droplets size={12} />
                        {cropData.water_need}
                      </span>
                    </div>

                    <div className="crop-stats">
                      <div 
                        className="stat-tag profit"
                        style={{ background: getProfitabilityColor(cropData.profitability) }}
                      >
                        <TrendingUp size={12} />
                        {cropData.profitability}
                      </div>
                      <div 
                        className="stat-tag risk"
                        style={{ background: getRiskColor(cropData.risk) }}
                      >
                        <Shield size={12} />
                        {cropData.risk}
                      </div>
                    </div>

                    <div className="crop-footer">
                      <span className="duration">
                        <Clock size={12} />
                        {cropData.duration}
                      </span>
                      <ChevronRight size={16} className="arrow" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Main Content */}
        <div className="modern-content">
          {selectedCrop ? (
            <div className="crop-detail-modern">
              {/* Crop Header */}
              <div className="detail-header">
                <div className="crop-hero">
                  <div className="hero-content">
                    <div className="crop-title-section">
                      <h1>{selectedCrop.name}</h1>
                      <div className="crop-badges">
                        <span 
                          className="badge main season"
                          style={{ background: getSeasonColor(selectedCrop.season) }}
                        >
                          <Calendar size={16} />
                          {selectedCrop.season}
                        </span>
                        <span 
                          className="badge main water"
                          style={{ background: getWaterNeedColor(selectedCrop.water_need) }}
                        >
                          <Droplets size={16} />
                          {selectedCrop.water_need} Water
                        </span>
                        <span 
                          className="badge main risk"
                          style={{ background: getRiskColor(selectedCrop.risk) }}
                        >
                          <Shield size={16} />
                          {selectedCrop.risk} Risk
                        </span>
                      </div>
                    </div>
                    <div className="hero-actions">
                      <button 
                        className={`favorite-btn large ${favorites.has(selectedCrop.name) ? 'active' : ''}`}
                        onClick={() => toggleFavorite(selectedCrop.name)}
                      >
                        <Heart size={20} fill={favorites.has(selectedCrop.name) ? 'currentColor' : 'none'} />
                        {favorites.has(selectedCrop.name) ? 'Saved' : 'Save'}
                      </button>
                      <button className="btn primary">
                        <Play size={16} />
                        Grow Guide
                      </button>
                    </div>
                  </div>
                  <div 
                    className="profit-hero"
                    style={{ background: getProfitabilityColor(selectedCrop.profitability) }}
                  >
                    <TrendingUp size={32} />
                    <div className="profit-content">
                      <div className="profit-label">Profit Potential</div>
                      <div className="profit-value">{selectedCrop.profitability}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <CropDetailTabs crop={selectedCrop} />

              {/* Tab Content */}
              <div className="detail-content">
                {renderTabContent()}
              </div>

              {/* Quick Actions */}
              <div className="quick-actions-modern">
                <h4>🚀 Quick Actions</h4>
                <div className="action-grid">
                  <button className="action-card">
                    <BarChart3 size={24} />
                    <span>Yield Prediction</span>
                    <ArrowRight size={16} />
                  </button>
                  <button className="action-card">
                    <CloudRain size={24} />
                    <span>Weather Analysis</span>
                    <ArrowRight size={16} />
                  </button>
                  <button className="action-card">
                    <Target size={24} />
                    <span>Get Recommendations</span>
                    <ArrowRight size={16} />
                  </button>
                  <button className="action-card">
                    <Download size={24} />
                    <span>Export Data</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="welcome-state">
              <div className="welcome-content">
                <div className="welcome-icon">
                  <Sprout size={80} />
                </div>
                <h2>Welcome to Crop Database</h2>
                <p>Select a crop from the directory to explore detailed cultivation guides, economic analysis, and AI-powered insights.</p>
                <div className="welcome-features">
                  <div className="feature">
                    <Zap size={20} />
                    <div>
                      <strong>AI Insights</strong>
                      <span>Smart recommendations</span>
                    </div>
                  </div>
                  <div className="feature">
                    <TrendingUp size={20} />
                    <div>
                      <strong>Profit Analysis</strong>
                      <span>Economic potential</span>
                    </div>
                  </div>
                  <div className="feature">
                    <Shield size={20} />
                    <div>
                      <strong>Risk Assessment</strong>
                      <span>Cultivation challenges</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropDatabase;