import React, { useState } from 'react';
import { 
  MapPin, 
  Droplets, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  BarChart3, // Added missing import
  Calculator,
  CloudRain,
  Sprout
} from 'lucide-react';
import api from '../services/axiosInstance';
import { getWeather } from '../services/api';
const CropRecommendation = ({ backendStatus }) => {
  const [formData, setFormData] = useState({
    location: '',
    soilType: 'Loamy',
    irrigationType: 'Canal',
    waterAvailability: 'Medium',
    season: 'Kharif',
    budget: 50000,
    riskTolerance: 'Medium',
    laborAvailability: 'Medium',
    marketPreference: ['Local Market'],
    organicFarming: false,
    farmArea: 10,
    fertilizer: 10000,
    pesticide: 5000,
    waterUsage: 5000,
    laborCost: 20000,
    equipmentCost: 30000
  });

  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('recommendations');
  const [weather, setWeather] = useState(null);
  const [errors, setErrors] = useState({});

  const soilTypes = ['Loamy', 'Sandy', 'Clay', 'Alluvial', 'Black', 'Red', 'Laterite'];
  const irrigationTypes = ['Canal', 'Tube-well', 'Rain-fed', 'Drip', 'Sprinkler'];
  const seasons = ['Kharif', 'Rabi', 'Zaid', 'Whole Year'];
  const marketOptions = ['Local Market', 'Export', 'Government', 'Contract Farming'];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (formData.farmArea <= 0) newErrors.farmArea = 'Farm area must be greater than 0';
    if (formData.budget <= 0) newErrors.budget = 'Budget must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleMarketPreferenceChange = (option) => {
    const current = formData.marketPreference;
    const updated = current.includes(option)
      ? current.filter(item => item !== option)
      : [...current, option];
    handleInputChange('marketPreference', updated);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  setLoading(true);
  setRecommendations(null);
  setWeather(null);

  try {
    // Add user_id if you have a logged-in user or demo
    const payload = { ...formData, user_id: 'demo_user_001' };

    // Send data to backend for DB storage & AI processing
    const response = await api.post('/api/crop-recommendation', payload);
    const result = response.data;

    // result should contain AI recommendations
    setRecommendations(result.recommendations);

    // Get weather if location is provided
    if (formData.location && formData.location !== 'Enter your district/region') {
      try {
        const weatherData = await getWeather(formData.location);
        setWeather(weatherData);
      } catch (weatherError) {
        console.warn('Weather data not available:', weatherError);
      }
    }

    setActiveTab('recommendations');
  } catch (error) {
    console.error('Error submitting crop recommendation:', error);

    // Fallback to mock data if backend fails
    const mockRecommendations = generateMockRecommendations(formData);
    setRecommendations(mockRecommendations);
  } finally {
    setLoading(false);
  }
};


  // Enhanced mock data generator with smart recommendations
  const generateMockRecommendations = (inputs) => {
    const cropData = {
      'Rice': { baseYield: 4.0, waterNeed: 'Very High', duration: 120, profitability: 'High', risk: 'Medium' },
      'Wheat': { baseYield: 3.5, waterNeed: 'Medium', duration: 120, profitability: 'Medium', risk: 'Low' },
      'Maize': { baseYield: 2.8, waterNeed: 'Medium', duration: 90, profitability: 'Medium', risk: 'Medium' },
      'Cotton': { baseYield: 1.8, waterNeed: 'Medium-High', duration: 160, profitability: 'High', risk: 'High' },
      'Sugarcane': { baseYield: 70, waterNeed: 'Very High', duration: 360, profitability: 'Very High', risk: 'Medium' }
    };

    // Smart scoring based on farm conditions
    const recommendations = Object.entries(cropData).map(([crop, data]) => {
      let suitabilityScore = 0;
      let matchReasons = [];

      // Water availability matching
      const waterMap = { 'Very Low': 1, 'Low': 2, 'Medium': 3, 'High': 4, 'Very High': 5 };
      const waterNeededMap = { 'Low': 1, 'Medium': 2, 'Medium-High': 3, 'High': 4, 'Very High': 5 };
      const waterDiff = Math.abs(waterMap[inputs.waterAvailability] - waterNeededMap[data.waterNeed]);
      
      if (waterDiff <= 1) {
        suitabilityScore += 35;
        matchReasons.push('✓ Water availability matches crop needs');
      } else if (waterDiff === 2) {
        suitabilityScore += 15;
        matchReasons.push('⚠ Water needs adjustment required');
      }

      // Soil type compatibility
      const soilCompatibility = {
        'Rice': ['Loamy', 'Alluvial', 'Clay'],
        'Wheat': ['Loamy', 'Alluvial'],
        'Maize': ['Sandy', 'Loamy'],
        'Cotton': ['Black', 'Loamy'],
        'Sugarcane': ['Loamy', 'Alluvial']
      };
      
      if (soilCompatibility[crop]?.includes(inputs.soilType)) {
        suitabilityScore += 30;
        matchReasons.push('✓ Soil type is optimal');
      } else {
        suitabilityScore += 10;
        matchReasons.push('⚠ Soil type acceptable');
      }

      // Season compatibility
      const seasonCrops = {
        'Kharif': ['Rice', 'Maize', 'Cotton'],
        'Rabi': ['Wheat', 'Sugarcane'],
        'Zaid': ['Maize'],
        'Whole Year': ['Sugarcane']
      };
      
      if (seasonCrops[inputs.season]?.includes(crop)) {
        suitabilityScore += 25;
        matchReasons.push('✓ Perfect for this season');
      } else {
        suitabilityScore += 5;
      }

      // Irrigation type bonus
      const irrigationBonus = {
        'Drip': 10,
        'Sprinkler': 8,
        'Canal': 7,
        'Tube-well': 5,
        'Rain-fed': 3
      };
      suitabilityScore += irrigationBonus[inputs.irrigationType] || 0;

      // Risk tolerance
      if (inputs.riskTolerance === 'Low' && data.risk === 'Low') {
        suitabilityScore += 10;
      } else if (inputs.riskTolerance === 'High' && data.risk === 'High') {
        suitabilityScore += 10;
      }

      // Budget considerations
      const estimatedCost = inputs.fertilizer + inputs.pesticide + inputs.laborCost + inputs.equipmentCost;
      if (estimatedCost >= inputs.budget * 0.8) {
        matchReasons.push('ℹ Fits within your budget');
      }

      // Calculate yields and profits
      const yieldAdjustment = (100 - Math.abs(waterDiff) * 10) / 100;
      const expectedYield = (data.baseYield * inputs.farmArea * yieldAdjustment).toFixed(2);
      const pricePerUnit = { 'Rice': 25, 'Wheat': 22, 'Maize': 18, 'Cotton': 65, 'Sugarcane': 3.5 };
      const revenue = expectedYield * inputs.farmArea * pricePerUnit[crop];
      const totalCost = inputs.fertilizer + inputs.pesticide + inputs.waterUsage * 0.5 + inputs.laborCost + inputs.equipmentCost;
      const netProfit = Math.floor(revenue - totalCost);
      const roi = totalCost > 0 ? Math.floor((netProfit / totalCost) * 100) : 0;

      const suitability = suitabilityScore >= 75 ? 'Suitable' : suitabilityScore >= 50 ? 'Moderate' : 'Not Suitable';

      return {
        crop,
        suitability,
        suitabilityScore,
        expectedYield: `${expectedYield} tons`,
        netProfit: Math.max(0, netProfit),
        roi: `${Math.max(0, roi)}%`,
        risk: data.risk,
        season: data.duration,
        waterNeed: data.waterNeed,
        duration: `${data.duration} days`,
        profitability: data.profitability,
        marketDemand: ['Low', 'Medium', 'High', 'Very High'][Math.floor(Math.random() * 4)],
        matchReasons,
        confidence: Math.min(100, suitabilityScore + 15)
      };
    }).sort((a, b) => b.suitabilityScore - a.suitabilityScore);

    return {
      recommendations,
      total_crops_evaluated: recommendations.length,
      message: '🤖 Smart AI Analysis Complete',
      topRecommendation: recommendations[0]?.crop,
      analysisDate: new Date().toLocaleDateString()
    };
  };

  const suitableCrops = recommendations?.recommendations?.filter(rec => rec.suitability === 'Suitable') || [];
  const notSuitableCrops = recommendations?.recommendations?.filter(rec => rec.suitability === 'Not Suitable') || [];

  return (
    <div className="crop-recommendation">
      <div className="page-header">
        <div className="header-icon">
          <Sprout size={32} />
        </div>
        <div className="header-content">
          <h1>🌱 Smart Crop Recommendation System</h1>
          <p>Get AI-powered crop recommendations based on your farm conditions and market trends</p>
        </div>
        <div className="header-badge">
          <span className={`status-badge ${backendStatus}`}>
            {backendStatus === 'connected' ? 'Live AI' : 'Demo Mode'}
          </span>
        </div>
      </div>

      <div className="recommendation-container">
        {/* Input Section */}
        <div className="input-section">
          <form onSubmit={handleSubmit} className="recommendation-form">
            <div className="form-section">
              <div className="section-header">
                <MapPin size={20} />
                <h3>📍 Farm Location & Conditions</h3>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    <MapPin size={16} />
                    Farm Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Enter your district/region"
                    className={errors.location ? 'error' : ''}
                  />
                  {errors.location && <span className="error-text">{errors.location}</span>}
                </div>

                <div className="form-group">
                  <label>Soil Type</label>
                  <select
                    value={formData.soilType}
                    onChange={(e) => handleInputChange('soilType', e.target.value)}
                  >
                    {soilTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Irrigation Type</label>
                  <select
                    value={formData.irrigationType}
                    onChange={(e) => handleInputChange('irrigationType', e.target.value)}
                  >
                    {irrigationTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    <Droplets size={16} />
                    Water Availability
                  </label>
                  <select
                    value={formData.waterAvailability}
                    onChange={(e) => handleInputChange('waterAvailability', e.target.value)}
                  >
                    {['Very Low', 'Low', 'Medium', 'High', 'Very High'].map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    <Calendar size={16} />
                    Season
                  </label>
                  <select
                    value={formData.season}
                    onChange={(e) => handleInputChange('season', e.target.value)}
                  >
                    {seasons.map(season => (
                      <option key={season} value={season}>{season}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Available Budget (₹) *</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', parseInt(e.target.value))}
                    min="1000"
                    max="1000000"
                    step="1000"
                    className={errors.budget ? 'error' : ''}
                  />
                  {errors.budget && <span className="error-text">{errors.budget}</span>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-header">
                <TrendingUp size={20} />
                <h3>🎯 Advanced Farming Preferences</h3>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Risk Tolerance</label>
                  <select
                    value={formData.riskTolerance}
                    onChange={(e) => handleInputChange('riskTolerance', e.target.value)}
                  >
                    {['Very Low', 'Low', 'Medium', 'High', 'Very High'].map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Labor Availability</label>
                  <select
                    value={formData.laborAvailability}
                    onChange={(e) => handleInputChange('laborAvailability', e.target.value)}
                  >
                    {['Very Low', 'Low', 'Medium', 'High', 'Very High'].map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Market Preference</label>
                  <div className="checkbox-group">
                    {marketOptions.map(option => (
                      <label key={option} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.marketPreference.includes(option)}
                          onChange={() => handleMarketPreferenceChange(option)}
                        />
                        <span className="checkmark"></span>
                        {option}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="checkbox-label large">
                    <input
                      type="checkbox"
                      checked={formData.organicFarming}
                      onChange={(e) => handleInputChange('organicFarming', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Organic Farming Preference
                  </label>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-header">
                <Calculator size={20} />
                <h3>💧 Resource Allocation</h3>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Farm Area (acres) *</label>
                  <input
                    type="number"
                    value={formData.farmArea}
                    onChange={(e) => handleInputChange('farmArea', parseFloat(e.target.value))}
                    min="0.1"
                    max="1000"
                    step="0.1"
                    className={errors.farmArea ? 'error' : ''}
                  />
                  {errors.farmArea && <span className="error-text">{errors.farmArea}</span>}
                </div>

                <div className="form-group">
                  <label>Fertilizer Budget (₹)</label>
                  <input
                    type="number"
                    value={formData.fertilizer}
                    onChange={(e) => handleInputChange('fertilizer', parseInt(e.target.value))}
                    min="0"
                    max="100000"
                    step="1000"
                  />
                </div>

                <div className="form-group">
                  <label>Pesticide Budget (₹)</label>
                  <input
                    type="number"
                    value={formData.pesticide}
                    onChange={(e) => handleInputChange('pesticide', parseInt(e.target.value))}
                    min="0"
                    max="50000"
                    step="1000"
                  />
                </div>

                <div className="form-group">
                  <label>Water Usage (cubic meters)</label>
                  <input
                    type="number"
                    value={formData.waterUsage}
                    onChange={(e) => handleInputChange('waterUsage', parseInt(e.target.value))}
                    min="0"
                    max="50000"
                    step="100"
                  />
                </div>

                <div className="form-group">
                  <label>Labor Cost (₹)</label>
                  <input
                    type="number"
                    value={formData.laborCost}
                    onChange={(e) => handleInputChange('laborCost', parseInt(e.target.value))}
                    min="0"
                    max="100000"
                    step="1000"
                  />
                </div>

                <div className="form-group">
                  <label>Equipment Cost (₹)</label>
                  <input
                    type="number"
                    value={formData.equipmentCost}
                    onChange={(e) => handleInputChange('equipmentCost', parseInt(e.target.value))}
                    min="0"
                    max="200000"
                    step="1000"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-button" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="button-spinner"></div>
                  Analyzing Farm Conditions...
                </>
              ) : (
                <>
                  <TrendingUp size={20} />
                  🚀 Get Smart Recommendations
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {recommendations && (
          <div className="results-section">
            <div className="results-header">
              <h3>🎯 AI Recommendations</h3>
              <p>{recommendations.message || `Analyzed ${recommendations.total_crops_evaluated || recommendations.recommendations.length} crops`}</p>
            </div>

            <div className="results-tabs">
              {[
                { id: 'recommendations', label: '🎯 Recommendations', icon: CheckCircle },
                { id: 'profitability', label: '💰 Profitability', icon: TrendingUp },
                { id: 'comparison', label: '📊 Comparison', icon: BarChart3 },
                { id: 'weather', label: '🌦️ Weather', icon: CloudRain }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="tab-content">
              {/* Recommendations Tab */}
              {activeTab === 'recommendations' && (
                <div className="recommendations-tab">
                  {suitableCrops.length > 0 && (
                    <div className="suitable-crops">
                      <div className="section-header success">
                        <CheckCircle size={24} />
                        <div>
                          <h4>✅ Recommended Crops ({suitableCrops.length} found)</h4>
                          <p>These crops are well-suited to your farm conditions</p>
                        </div>
                      </div>
                      <div className="crops-grid">
                        {suitableCrops.map((crop, index) => (
                          <CropCard key={index} crop={crop} />
                        ))}
                      </div>
                    </div>
                  )}

                  {notSuitableCrops.length > 0 && (
                    <div className="not-suitable-crops">
                      <div className="section-header warning">
                        <AlertTriangle size={24} />
                        <div>
                          <h4>⚠️ Not Recommended ({notSuitableCrops.length} crops)</h4>
                          <p>These crops may not be suitable for your current conditions</p>
                        </div>
                      </div>
                      <div className="crops-list">
                        {notSuitableCrops.map((crop, index) => (
                          <div key={index} className="crop-item not-suitable">
                            <span className="crop-name">{crop.crop}</span>
                            <span className="crop-reason">Not optimal for current setup</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Profitability Tab */}
              {activeTab === 'profitability' && suitableCrops.length > 0 && (
                <div className="profitability-tab">
                  <div className="profitability-grid">
                    {suitableCrops.map((crop, index) => (
                      <ProfitabilityCard key={index} crop={crop} />
                    ))}
                  </div>
                </div>
              )}

              {/* Comparison Tab */}
              {activeTab === 'comparison' && suitableCrops.length > 0 && (
                <div className="comparison-tab">
                  <div className="comparison-chart">
                    <h4>Crop Comparison</h4>
                    <div className="comparison-bars">
                      {suitableCrops.map((crop, index) => (
                        <div key={index} className="comparison-item">
                          <span className="crop-name">{crop.crop}</span>
                          <div className="comparison-bar">
                            <div 
                              className="bar-fill" 
                              style={{ width: `${parseInt(crop.roi)}%` }}
                            ></div>
                          </div>
                          <span className="roi-value">{crop.roi}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Weather Tab */}
              {activeTab === 'weather' && (
                <div className="weather-tab">
                  {weather ? (
                    <div className="weather-info">
                      <h4>🌤️ Weather for {formData.location}</h4>
                      <div className="weather-cards">
                        <div className="weather-card">
                          <CloudRain size={24} />
                          <span>Temperature: {weather.temperature || '25-32°C'}</span>
                        </div>
                        <div className="weather-card">
                          <Droplets size={24} />
                          <span>Rainfall: {weather.rainfall || 'Low chance'}</span>
                        </div>
                        <div className="weather-card">
                          <span>Humidity: {weather.humidity || '65-80%'}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="weather-placeholder">
                      <CloudRain size={48} />
                      <p>Enter location to see weather data</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Crop Card Component
const CropCard = ({ crop }) => (
  <div className="crop-card">
    <div className="crop-name">{crop.crop}</div>
    <span className="crop-badge">{crop.suitability}</span>
    
    <div className="suitability-score">
      <div className="score-bar">
        <div 
          className="score-fill" 
          style={{ width: `${crop.suitabilityScore || 75}%` }}
        ></div>
      </div>
      <span className="score-text">{crop.suitabilityScore || 75}%</span>
    </div>

    <div className="crop-metrics">
      <div className="metric-item">
        <span className="metric-label">Expected Yield:</span>
        <span className="metric-value">{crop.expectedYield}</span>
      </div>
      <div className="metric-item">
        <span className="metric-label">Water Need:</span>
        <span className="metric-value">{crop.waterNeed}</span>
      </div>
      <div className="metric-item">
        <span className="metric-label">Duration:</span>
        <span className="metric-value">{crop.duration}</span>
      </div>
      <div className="metric-item">
        <span className="metric-label">Risk Level:</span>
        <span className="metric-value">{crop.risk}</span>
      </div>
      <div className="metric-item">
        <span className="metric-label">Net Profit:</span>
        <span className="metric-value" style={{ color: '#10b981', fontWeight: '700' }}>
          ₹{crop.netProfit?.toLocaleString() || '0'}
        </span>
      </div>
      <div className="metric-item">
        <span className="metric-label">ROI:</span>
        <span className="metric-value">{crop.roi}</span>
      </div>
    </div>

    {crop.matchReasons && crop.matchReasons.length > 0 && (
      <div className="match-reasons">
        <ul style={{ margin: 0, paddingLeft: '16px' }}>
          {crop.matchReasons.slice(0, 2).map((reason, idx) => (
            <li key={idx}>{reason}</li>
          ))}
        </ul>
      </div>
    )}

    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '8px' }}>
      <span className="tag profitability">{crop.profitability}</span>
      <span className="tag demand">{crop.marketDemand} Demand</span>
    </div>
  </div>
);

// Profitability Card Component
const ProfitabilityCard = ({ crop }) => (
  <div className="profitability-card">
    <div className="profit-header">
      <span className="profit-crop-name">{crop.crop}</span>
      <span className="profit-badge">{crop.profitability}</span>
    </div>
    
    <div className="profit-stats">
      <div className="profit-stat">
        <span className="profit-stat-label">Expected Yield</span>
        <span className="profit-stat-value">{crop.expectedYield}</span>
      </div>
      <div className="profit-stat">
        <span className="profit-stat-label">Water Requirement</span>
        <span className="profit-stat-value">{crop.waterNeed}</span>
      </div>
      <div className="profit-stat">
        <span className="profit-stat-label">Duration</span>
        <span className="profit-stat-value">{crop.duration}</span>
      </div>
      <div className="profit-stat">
        <span className="profit-stat-label">Risk Level</span>
        <span className="profit-stat-value">{crop.risk}</span>
      </div>
      <div className="profit-stat">
        <span className="profit-stat-label">Market Demand</span>
        <span className="profit-stat-value">{crop.marketDemand}</span>
      </div>
    </div>

    <div className="net-profit-highlight">
      💰 Net Profit: ₹{crop.netProfit?.toLocaleString() || '0'}
    </div>
    
    <div className="profit-stat" style={{ marginTop: '8px', borderBottom: 'none' }}>
      <span className="profit-stat-label">ROI</span>
      <span className="profit-stat-value" style={{ color: '#10b981' }}>{crop.roi}</span>
    </div>
  </div>
);
export default CropRecommendation; 