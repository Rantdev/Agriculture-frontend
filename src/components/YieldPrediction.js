// src/components/YieldPrediction.js - Updated with Column Layout
import  { useState, useEffect , useMemo } from 'react';
import {
  BarChart3, Shield, AlertTriangle, CheckCircle,
  Calculator, Droplets, Target, Leaf, Cloud, Brain, RefreshCw,  IndianRupee, Zap, Layers
} from 'lucide-react';

const YieldPrediction = ({ backendStatus }) => {
  const [formData, setFormData] = useState({
    // Basic Information
    cropType: 'Wheat',
    farmArea: 10,
    region: 'North',
    season: 'Kharif',
    
    // Soil & Inputs
    soilType: 'Loamy',
    soilPh: 6.5,
    soilMoisture: 65,
    organicContent: 2.5,
    
    // Water Management
    irrigationType: 'Canal',
    waterUsage: 5000,
    waterQuality: 'Good',
    rainfallExpected: 750,
    
    // Fertilizers & Chemicals
    fertilizer: 2.0,
    pesticide: 10.0,
    organicFertilizer: false,
    ipmApproach: false,
    
    // Management
    experienceLevel: 'Intermediate',
    previousYield: 3.5,
    
    // Climate
    temperature: 25,
    humidity: 65,
    sunlightHours: 8
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('inputs');
  const [predictionHistory, setPredictionHistory] = useState([]);

  // Crop database from backend
 const cropDatabase = useMemo(() => ({
    'Rice': { base_yield: 4.0, optimal_fertilizer: 2.5, optimal_water: 6000 },
    'Wheat': { base_yield: 3.5, optimal_fertilizer: 2.0, optimal_water: 4000 },
    'Maize': { base_yield: 2.8, optimal_fertilizer: 1.8, optimal_water: 3500 },
    'Cotton': { base_yield: 1.8, optimal_fertilizer: 2.2, optimal_water: 4500 },
    'Sugarcane': { base_yield: 70.0, optimal_fertilizer: 3.0, optimal_water: 8000 }
  }), []);

  // Update form when crop changes to show optimal values
  useEffect(() => {
    const cropData = cropDatabase[formData.cropType];
    if (cropData) {
      setFormData(prev => ({
        ...prev,
        fertilizer: cropData.optimal_fertilizer,
        waterUsage: cropData.optimal_water
      }));
    }
  }, [cropDatabase, formData.cropType]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.farmArea <= 0) newErrors.farmArea = 'Farm area must be greater than 0';
    if (formData.fertilizer < 0) newErrors.fertilizer = 'Fertilizer cannot be negative';
    if (formData.soilPh < 4 || formData.soilPh > 9) newErrors.soilPh = 'Soil pH must be between 4 and 9';
    if (formData.waterUsage < 0) newErrors.waterUsage = 'Water usage cannot be negative';
    if (formData.temperature < -10 || formData.temperature > 50) newErrors.temperature = 'Temperature must be realistic';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Enhanced prediction result with additional calculations
      const enhancedResult = {
        ...result,
        profitability: calculateProfitability(result.predicted_yield, formData),
        environmental_impact: calculateEnvironmentalImpact(formData, result.predicted_yield),
        quick_tips: generateQuickTips(formData, cropDatabase[formData.cropType]),
        timestamp: new Date().toISOString(),
        prediction_id: `PRED_${Date.now()}`
      };

      setPrediction(enhancedResult);
      
      // Save to history
      setPredictionHistory(prev => [{
        timestamp: new Date().toLocaleString(),
        inputs: { ...formData },
        result: enhancedResult
      }, ...prev.slice(0, 4)]);

    } catch (error) {
      console.error('Prediction error:', error);
      // Fallback to client-side calculation if backend fails
      calculateFallbackPrediction();
    } finally {
      setLoading(false);
    }
  };

  const calculateFallbackPrediction = () => {
    // Client-side fallback calculation
    const cropData = cropDatabase[formData.cropType];
    if (!cropData) return;

    const baseYield = cropData.base_yield;
    
    // Realistic modifiers based on inputs
    const modifiers = {
      soil: calculateSoilEffect(formData),
      water: calculateWaterEffect(formData, cropData),
      fertilizer: calculateFertilizerEffect(formData, cropData),
      management: calculateManagementEffect(formData),
      climate: calculateClimateEffect(formData)
    };

    let predictedYield = baseYield;
    Object.values(modifiers).forEach(modifier => {
      predictedYield *= modifier;
    });

    // Add some randomness for realism
    const randomVariation = 0.9 + (Math.random() * 0.2);
    predictedYield *= randomVariation;

    const confidence = calculateConfidence(formData, cropData);
    const suitability = determineSuitability(predictedYield, baseYield);

    setPrediction({
      predicted_yield: Math.round(predictedYield * 100) / 100,
      confidence: Math.round(confidence * 100) / 100,
      suitability: suitability,
      yield_range: {
        min: Math.round(predictedYield * 0.85 * 100) / 100,
        max: Math.round(predictedYield * 1.15 * 100) / 100
      },
      optimization_score: calculateOptimizationScore(formData, cropData),
      risk_factors: generateRiskFactors(formData, predictedYield, baseYield),
      recommendations: generateRecommendations(formData, cropData),
      profitability: calculateProfitability(predictedYield, formData),
      environmental_impact: calculateEnvironmentalImpact(formData, predictedYield),
      quick_tips: generateQuickTips(formData, cropData),
      message: 'Calculated using fallback algorithm'
    });
  };

  // Realistic calculation functions (keep all the calculation functions as they are)
  const calculateSoilEffect = (inputs) => {
    let effect = 1.0;
    const soilEffects = {
      'Loamy': 1.0, 'Sandy': 0.8, 'Clay': 0.9, 
      'Alluvial': 1.1, 'Black': 1.05, 'Red': 0.75
    };
    effect *= soilEffects[inputs.soilType] || 1.0;
    
    const optimalPh = 6.5;
    const phDiff = Math.abs(inputs.soilPh - optimalPh);
    if (phDiff <= 0.5) effect *= 1.0;
    else if (phDiff <= 1.0) effect *= 0.95;
    else if (phDiff <= 1.5) effect *= 0.85;
    else effect *= 0.7;
    
    effect *= (0.9 + (inputs.organicContent * 0.04));
    return effect;
  };

  const calculateWaterEffect = (inputs, cropData) => {
    const optimalWater = cropData.optimal_water;
    const actualWater = inputs.waterUsage;
    const ratio = actualWater / optimalWater;
    
    if (ratio >= 0.9 && ratio <= 1.1) return 1.0;
    else if (ratio >= 0.7 && ratio < 0.9) return 0.85;
    else if (ratio >= 1.1 && ratio <= 1.3) return 0.9;
    else if (ratio < 0.7) return 0.7;
    else return 0.8;
  };

  const calculateFertilizerEffect = (inputs, cropData) => {
    const optimalFert = cropData.optimal_fertilizer;
    const actualFert = inputs.fertilizer;
    const ratio = actualFert / optimalFert;
    
    if (ratio >= 0.9 && ratio <= 1.1) return 1.0;
    else if (ratio >= 0.7 && ratio < 0.9) return 0.9;
    else if (ratio >= 1.1 && ratio <= 1.3) return 0.95;
    else if (ratio < 0.7) return 0.8;
    else return 0.85;
  };

  const calculateManagementEffect = (inputs) => {
    let effect = 1.0;
    const experienceEffects = {
      'Beginner': 0.9, 'Intermediate': 1.0, 'Expert': 1.1
    };
    effect *= experienceEffects[inputs.experienceLevel] || 1.0;
    
    if (inputs.organicFertilizer) effect *= 1.05;
    if (inputs.ipmApproach) effect *= 1.03;
    
    return effect;
  };

  const calculateClimateEffect = (inputs) => {
    let effect = 1.0;
    const tempDiff = Math.abs(inputs.temperature - 27);
    if (tempDiff <= 3) effect *= 1.0;
    else if (tempDiff <= 6) effect *= 0.95;
    else if (tempDiff <= 9) effect *= 0.85;
    else effect *= 0.7;
    
    if (inputs.humidity >= 60 && inputs.humidity <= 80) effect *= 1.0;
    else if (inputs.humidity >= 50 && inputs.humidity < 60) effect *= 0.95;
    else if (inputs.humidity > 80 && inputs.humidity <= 90) effect *= 0.9;
    else effect *= 0.8;
    
    return effect;
  };

  const calculateConfidence = (inputs, cropData) => {
    let confidence = 0.7;
    if (inputs.fertilizer >= cropData.optimal_fertilizer * 0.8 && 
        inputs.fertilizer <= cropData.optimal_fertilizer * 1.2) {
      confidence += 0.1;
    }
    
    if (inputs.waterUsage >= cropData.optimal_water * 0.8 && 
        inputs.waterUsage <= cropData.optimal_water * 1.2) {
      confidence += 0.1;
    }
    
    if (inputs.soilPh >= 5.5 && inputs.soilPh <= 7.5) confidence += 0.05;
    if (inputs.experienceLevel === 'Expert') confidence += 0.05;
    
    return Math.min(confidence, 0.95);
  };

  const determineSuitability = (predictedYield, baseYield) => {
    const percentage = (predictedYield / baseYield) * 100;
    if (percentage >= 90) return "Highly Suitable";
    else if (percentage >= 75) return "Suitable";
    else if (percentage >= 60) return "Moderately Suitable";
    else return "Not Suitable";
  };

  const calculateOptimizationScore = (inputs, cropData) => {
    let score = 50;
    const fertOptimal = inputs.fertilizer >= cropData.optimal_fertilizer * 0.9 && 
                       inputs.fertilizer <= cropData.optimal_fertilizer * 1.1;
    const waterOptimal = inputs.waterUsage >= cropData.optimal_water * 0.9 && 
                        inputs.waterUsage <= cropData.optimal_water * 1.1;
    
    if (fertOptimal) score += 20;
    if (waterOptimal) score += 20;
    if (inputs.organicFertilizer) score += 10;
    if (inputs.ipmApproach) score += 10;
    
    return Math.min(score, 100);
  };

  const generateRiskFactors = (inputs, predictedYield, baseYield) => {
    const factors = [];
    const yieldPercentage = (predictedYield / baseYield) * 100;
    
    if (yieldPercentage < 70) {
      factors.push("Yield significantly below optimal potential");
    }
    
    if (inputs.waterQuality === 'Poor') {
      factors.push("Poor water quality may affect crop health");
    }
    
    if (inputs.fertilizer < cropDatabase[inputs.cropType].optimal_fertilizer * 0.7) {
      factors.push("Insufficient fertilizer for optimal growth");
    }
    
    return factors;
  };

  const generateRecommendations = (inputs, cropData) => {
    const recommendations = [];
    
    if (inputs.fertilizer < cropData.optimal_fertilizer * 0.8) {
      recommendations.push(`Increase fertilizer to ${cropData.optimal_fertilizer} tons for better yield`);
    }
    
    if (inputs.waterUsage < cropData.optimal_water * 0.8) {
      recommendations.push(`Increase water supply to ${cropData.optimal_water}m³ for optimal growth`);
    }
    
    if (!inputs.organicFertilizer) {
      recommendations.push("Consider organic fertilizers for long-term soil health");
    }
    
    return recommendations;
  };

  const calculateProfitability = (predictedYield, inputs) => {
    const marketPrices = {
      'Rice': 25, 'Wheat': 22, 'Maize': 18, 'Cotton': 65, 'Sugarcane': 3.5
    };
    
    const price = marketPrices[inputs.cropType] || 20;
    const revenue = predictedYield * inputs.farmArea * price;
    
    const costs = {
      fertilizer: inputs.fertilizer * 5000,
      pesticide: inputs.pesticide * 200,
      labor: inputs.farmArea * 3000,
      water: inputs.waterUsage * 0.1,
      equipment: inputs.farmArea * 2000
    };
    
    const totalCost = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
    const profit = revenue - totalCost;
    const roi = (profit / totalCost) * 100;

    return {
      revenue: Math.round(revenue),
      costs: Math.round(totalCost),
      profit: Math.round(profit),
      roi: Math.round(roi * 100) / 100,
      break_even: Math.round(totalCost / (price * predictedYield))
    };
  };

  const calculateEnvironmentalImpact = (inputs, predictedYield) => {
    return {
      waterUsage: inputs.waterUsage,
      carbonFootprint: Math.round(predictedYield * 50),
      sustainabilityScore: calculateSustainabilityScore(inputs)
    };
  };

  const calculateSustainabilityScore = (inputs) => {
    let score = 50;
    if (inputs.organicFertilizer) score += 20;
    if (inputs.ipmApproach) score += 15;
    if (inputs.waterQuality === 'Excellent') score += 10;
    if (inputs.irrigationType === 'Drip') score += 5;
    return Math.min(score, 100);
  };

  const generateQuickTips = (inputs, cropData) => {
    const tips = [];
    
    if (inputs.fertilizer < cropData.optimal_fertilizer * 0.9) {
      tips.push(`Increase fertilizer to ${cropData.optimal_fertilizer} tons for optimal growth`);
    }
    
    if (inputs.waterUsage < cropData.optimal_water * 0.9) {
      tips.push(`Optimize water usage to ${cropData.optimal_water}m³ for better yield`);
    }
    
    if (!inputs.organicFertilizer) {
      tips.push('Consider organic fertilizers for soil health');
    }
    
    return tips.slice(0, 3);
  };

  const resetForm = () => {
    setFormData({
      cropType: 'Wheat',
      farmArea: 10,
      region: 'North',
      season: 'Kharif',
      soilType: 'Loamy',
      soilPh: 6.5,
      soilMoisture: 65,
      organicContent: 2.5,
      irrigationType: 'Canal',
      waterUsage: 5000,
      waterQuality: 'Good',
      rainfallExpected: 750,
      fertilizer: 2.0,
      pesticide: 10.0,
      organicFertilizer: false,
      ipmApproach: false,
      experienceLevel: 'Intermediate',
      previousYield: 3.5,
      temperature: 25,
      humidity: 65,
      sunlightHours: 8
    });
    setPrediction(null);
    setErrors({});
  };

  return (
    <div className="yield-prediction-ultra">
      {/* Header */}
      <div className="ultra-header">
        <div className="header-content">
          <div className="header-main">
            <div className="header-icon">
              <BarChart3 size={48} />
              <div className="ai-badge">
                <Brain size={16} />
                AI Powered
              </div>
            </div>
            <div className="header-text">
              <h1>🌾 Real Yield Predictor</h1>
              <p>Advanced AI-powered crop yield prediction with realistic algorithms</p>
            </div>
          </div>
          <div className="header-controls">
            <div className={`status-indicator ${backendStatus === 'connected' ? 'connected' : 'disconnected'}`}>
              {backendStatus === 'connected' ? '✅ Backend Connected' : '❌ Backend Offline'}
            </div>
          </div>
        </div>
      </div>

      <div className="ultra-container">
        {/* Tabs */}
        <div className="prediction-tabs enhanced">
          <button className={`tab ${activeTab === 'inputs' ? 'active' : ''}`}
            onClick={() => setActiveTab('inputs')}>
            <Calculator size={16} />
            Farm Inputs
          </button>
          <button className={`tab ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')} disabled={!prediction}>
            <BarChart3 size={16} />
            Results
          </button>
          <button className={`tab ${activeTab === 'profitability' ? 'active' : ''}`}
            onClick={() => setActiveTab('profitability')} disabled={!prediction}>
            <BarChart3 size={16} />
            Profitability
          </button>
        </div>

        <div className="ultra-content">
          {/* Main Content Area with Columns */}
          <div className="content-columns">
            
            {/* Left Column - Inputs/Results */}
            <div className="main-column">
              {activeTab === 'inputs' && (
                <div className="inputs-container">
                  <div className="inputs-main">
                    <form onSubmit={handleSubmit}>
                      
                      {/* Column 1: Basic Information & Soil */}
                      <div className="form-columns">
                        <div className="form-column">
                          {/* Basic Information */}
                          <div className="form-section">
                            <div className="section-header">
                              <Leaf size={20} />
                              <h3>🌱 Basic Information</h3>
                            </div>
                            <div className="form-grid">
                              <div className="form-group">
                                <label>Crop Type</label>
                                <select 
                                  value={formData.cropType}
                                  onChange={(e) => handleInputChange('cropType', e.target.value)}
                                >
                                  <option value="Rice">🌾 Rice</option>
                                  <option value="Wheat">🌾 Wheat</option>
                                  <option value="Maize">🌽 Maize</option>
                                  <option value="Cotton">🧵 Cotton</option>
                                  <option value="Sugarcane">🎋 Sugarcane</option>
                                </select>
                                <div className="input-hint">
                                  Optimal: {cropDatabase[formData.cropType]?.optimal_fertilizer} tons fertilizer, {cropDatabase[formData.cropType]?.optimal_water}m³ water
                                </div>
                              </div>
                              
                              <div className="form-group">
                                <label>Farm Area (acres)</label>
                                <input 
                                  type="number" 
                                  min="0.1" 
                                  max="1000"
                                  step="0.1"
                                  value={formData.farmArea}
                                  onChange={(e) => handleInputChange('farmArea', parseFloat(e.target.value))}
                                />
                                {errors.farmArea && <div className="error-text">{errors.farmArea}</div>}
                              </div>

                              <div className="form-group">
                                <label>Region</label>
                                <select 
                                  value={formData.region}
                                  onChange={(e) => handleInputChange('region', e.target.value)}
                                >
                                  <option value="North">North</option>
                                  <option value="South">South</option>
                                  <option value="East">East</option>
                                  <option value="West">West</option>
                                  <option value="Central">Central</option>
                                </select>
                              </div>

                              <div className="form-group">
                                <label>Season</label>
                                <select 
                                  value={formData.season}
                                  onChange={(e) => handleInputChange('season', e.target.value)}
                                >
                                  <option value="Kharif">Kharif</option>
                                  <option value="Rabi">Rabi</option>
                                  <option value="Zaid">Zaid</option>
                                  <option value="Whole Year">Whole Year</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Soil Management */}
                          <div className="form-section">
                            <div className="section-header">
                              <Layers size={20} />
                              <h3>🌿 Soil Management</h3>
                            </div>
                            <div className="form-grid">
                              <div className="form-group">
                                <label>Soil Type</label>
                                <select 
                                  value={formData.soilType}
                                  onChange={(e) => handleInputChange('soilType', e.target.value)}
                                >
                                  <option value="Loamy">Loamy</option>
                                  <option value="Sandy">Sandy</option>
                                  <option value="Clay">Clay</option>
                                  <option value="Alluvial">Alluvial</option>
                                  <option value="Black">Black Cotton</option>
                                  <option value="Red">Red</option>
                                </select>
                              </div>

                              <div className="form-group">
                                <label>Soil pH</label>
                                <input 
                                  type="number" 
                                  step="0.1" 
                                  min="4" 
                                  max="9"
                                  value={formData.soilPh}
                                  onChange={(e) => handleInputChange('soilPh', parseFloat(e.target.value))}
                                />
                                {errors.soilPh && <div className="error-text">{errors.soilPh}</div>}
                              </div>

                              <div className="form-group">
                                <label>Organic Content (%)</label>
                                <input 
                                  type="number" 
                                  step="0.1" 
                                  min="0" 
                                  max="10"
                                  value={formData.organicContent}
                                  onChange={(e) => handleInputChange('organicContent', parseFloat(e.target.value))}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Column 2: Water & Fertilizer */}
                        <div className="form-column">
                          {/* Water Management */}
                          <div className="form-section">
                            <div className="section-header">
                              <Droplets size={20} />
                              <h3>💧 Water Management</h3>
                            </div>
                            <div className="form-grid">
                              <div className="form-group">
                                <label>Irrigation Type</label>
                                <select 
                                  value={formData.irrigationType}
                                  onChange={(e) => handleInputChange('irrigationType', e.target.value)}
                                >
                                  <option value="Canal">Canal</option>
                                  <option value="Tube-well">Tube-well</option>
                                  <option value="Rain-fed">Rain-fed</option>
                                  <option value="Drip">Drip</option>
                                  <option value="Sprinkler">Sprinkler</option>
                                </select>
                              </div>

                              <div className="form-group">
                                <label>Water Usage (m³)</label>
                                <input 
                                  type="number" 
                                  min="0" 
                                  max="20000"
                                  value={formData.waterUsage}
                                  onChange={(e) => handleInputChange('waterUsage', parseInt(e.target.value))}
                                />
                                {errors.waterUsage && <div className="error-text">{errors.waterUsage}</div>}
                                <div className="input-hint">
                                  Optimal for {formData.cropType}: {cropDatabase[formData.cropType]?.optimal_water}m³
                                </div>
                              </div>

                              <div className="form-group">
                                <label>Water Quality</label>
                                <select 
                                  value={formData.waterQuality}
                                  onChange={(e) => handleInputChange('waterQuality', e.target.value)}
                                >
                                  <option value="Poor">Poor</option>
                                  <option value="Average">Average</option>
                                  <option value="Good">Good</option>
                                  <option value="Excellent">Excellent</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Fertilizer Management */}
                          <div className="form-section">
                            <div className="section-header">
                              <Zap size={20} />
                              <h3>⚡ Fertilizer & Inputs</h3>
                            </div>
                            <div className="form-grid">
                              <div className="form-group">
                                <label>Fertilizer (tons)</label>
                                <input 
                                  type="number" 
                                  step="0.1" 
                                  min="0" 
                                  max="10"
                                  value={formData.fertilizer}
                                  onChange={(e) => handleInputChange('fertilizer', parseFloat(e.target.value))}
                                />
                                {errors.fertilizer && <div className="error-text">{errors.fertilizer}</div>}
                                <div className="input-hint">
                                  Optimal for {formData.cropType}: {cropDatabase[formData.cropType]?.optimal_fertilizer} tons
                                </div>
                              </div>

                              <div className="form-group">
                                <label>Pesticide (kg)</label>
                                <input 
                                  type="number" 
                                  min="0" 
                                  max="100"
                                  value={formData.pesticide}
                                  onChange={(e) => handleInputChange('pesticide', parseFloat(e.target.value))}
                                />
                              </div>

                              <div className="form-group checkbox-group">
                                <label>
                                  <input 
                                    type="checkbox" 
                                    checked={formData.organicFertilizer}
                                    onChange={(e) => handleInputChange('organicFertilizer', e.target.checked)}
                                  />
                                  <span className="checkmark"></span>
                                  Use Organic Fertilizer
                                </label>
                              </div>

                              <div className="form-group checkbox-group">
                                <label>
                                  <input 
                                    type="checkbox" 
                                    checked={formData.ipmApproach}
                                    onChange={(e) => handleInputChange('ipmApproach', e.target.checked)}
                                  />
                                  <span className="checkmark"></span>
                                  IPM Approach
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Column 3: Management & Climate */}
                        <div className="form-column">
                          {/* Management & Climate */}
                          <div className="form-section">
                            <div className="section-header">
                              <Target size={20} />
                              <h3>🎯 Management & Climate</h3>
                            </div>
                            <div className="form-grid">
                              <div className="form-group">
                                <label>Experience Level</label>
                                <select 
                                  value={formData.experienceLevel}
                                  onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                                >
                                  <option value="Beginner">Beginner</option>
                                  <option value="Intermediate">Intermediate</option>
                                  <option value="Expert">Expert</option>
                                </select>
                              </div>

                              <div className="form-group">
                                <label>Temperature (°C)</label>
                                <input 
                                  type="number" 
                                  min="-10" 
                                  max="50"
                                  value={formData.temperature}
                                  onChange={(e) => handleInputChange('temperature', parseInt(e.target.value))}
                                />
                                {errors.temperature && <div className="error-text">{errors.temperature}</div>}
                              </div>

                              <div className="form-group">
                                <label>Humidity (%)</label>
                                <input 
                                  type="number" 
                                  min="0" 
                                  max="100"
                                  value={formData.humidity}
                                  onChange={(e) => handleInputChange('humidity', parseInt(e.target.value))}
                                />
                              </div>

                              <div className="form-group">
                                <label>Sunlight Hours</label>
                                <input 
                                  type="number" 
                                  min="0" 
                                  max="16"
                                  value={formData.sunlightHours}
                                  onChange={(e) => handleInputChange('sunlightHours', parseInt(e.target.value))}
                                />
                              </div>

                              <div className="form-group">
                                <label>Previous Yield (tons)</label>
                                <input 
                                  type="number" 
                                  step="0.1" 
                                  min="0" 
                                  max="100"
                                  value={formData.previousYield}
                                  onChange={(e) => handleInputChange('previousYield', parseFloat(e.target.value))}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Form Actions */}
                          <div className="form-actions enhanced">
                            <button type="button" className="btn outline" onClick={resetForm}>
                              <RefreshCw size={16} />
                              Reset All
                            </button>
                            <button type="submit" className="btn primary large" disabled={loading}>
                              {loading ? (
                                <>
                                  <div className="button-spinner"></div>
                                  Calculating Yield...
                                </>
                              ) : (
                                <>
                                  <Brain size={20} />
                                  Predict Yield
                                  <Zap size={16} />
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Results Tab Content */}
              {activeTab === 'results' && prediction && (
                <div className="results-container">
                  {/* Results content remains the same */}
                  <div className="prediction-hero">
                    <div className="hero-card primary">
                      <div className="card-icon">
                        <BarChart3 size={32} />
                      </div>
                      <div className="card-content">
                        <div className="card-label">Predicted Yield</div>
                        <div className="prediction-value">{prediction.predicted_yield} tons</div>
                        <div className="prediction-subtext">per acre</div>
                        <div className="yield-comparison">
                          <span className="comparison-label">Range:</span>
                          <span className="comparison-value">
                            {prediction.yield_range?.min || (prediction.predicted_yield * 0.85).toFixed(1)} - {prediction.yield_range?.max || (prediction.predicted_yield * 1.15).toFixed(1)} tons
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="hero-card secondary">
                      <div className="card-icon">
                        <Shield size={32} />
                      </div>
                      <div className="card-content">
                        <div className="card-label">Confidence</div>
                        <div className="confidence-value">{Math.round((prediction.confidence || 0.7) * 100)}%</div>
                        <div className="confidence-bar">
                          <div 
                            className="confidence-fill"
                            style={{ width: `${(prediction.confidence || 0.7) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="hero-card accent">
                      <div className="card-icon">
                        <CheckCircle size={32} />
                      </div>
                      <div className="card-content">
                        <div className="card-label">Suitability</div>
                        <div className="optimization-value">{prediction.suitability || 'Highly Suitable'}</div>
                        <div className="optimization-bar">
                          <div 
                            className="optimization-fill"
                            style={{ width: `${prediction.optimization_score || 75}%` }}
                          ></div>
                        </div>
                        <div className="optimization-status">
                          Optimization: {prediction.optimization_score || 75}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Risk Factors, Recommendations, Quick Tips sections remain the same */}
                  {prediction.risk_factors && prediction.risk_factors.length > 0 && (
                    <div className="risk-section">
                      <h3>⚠️ Risk Factors</h3>
                      <div className="risk-factors">
                        {prediction.risk_factors.map((factor, index) => (
                          <div key={index} className="risk-factor high">
                            <AlertTriangle size={16} />
                            <div className="risk-content">
                              <div className="risk-message">{factor}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {prediction.recommendations && prediction.recommendations.length > 0 && (
                    <div className="recommendations-section">
                      <h3>💡 Recommendations</h3>
                      <div className="recommendations-list">
                        {prediction.recommendations.map((rec, index) => (
                          <div key={index} className="recommendation-item">
                            <div className="rec-number">{index + 1}</div>
                            <div className="rec-content">
                              <p>{rec}</p>
                              <span className="rec-impact">High Impact</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {prediction.quick_tips && (
                    <div className="quick-tips-section">
                      <h3>🚀 Quick Tips</h3>
                      <div className="tips-grid">
                        {prediction.quick_tips.map((tip, index) => (
                          <div key={index} className="tip-card">
                            <Zap size={16} />
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Profitability Tab Content */}
              {activeTab === 'profitability' && prediction && prediction.profitability && (
                <div className="profitability-container">
                  {/* Profitability content remains the same */}
                  <div className="profitability-hero">
                    <div className="profit-card revenue">
                      <IndianRupee size={24} />
                      <div className="profit-content">
                        <div className="profit-label">Estimated Revenue</div>
                        <div className="profit-value">₹{prediction.profitability.revenue.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="profit-card cost">
                      <Calculator size={24} />
                      <div className="profit-content">
                        <div className="profit-label">Estimated Costs</div>
                        <div className="profit-value">₹{prediction.profitability.costs.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="profit-card net">
                      <BarChart3 size={24} />
                      <div className="profit-content">
                        <div className="profit-label">Net Profit</div>
                        <div className="profit-value">₹{prediction.profitability.profit.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="profit-card roi">
                      <Target size={24} />
                      <div className="profit-content">
                        <div className="profit-label">ROI</div>
                        <div className="profit-value">{prediction.profitability.roi}%</div>
                      </div>
                    </div>
                  </div>

                  {prediction.environmental_impact && (
                    <div className="environmental-section">
                      <h3>🌿 Environmental Impact</h3>
                      <div className="environmental-metrics">
                        <div className="env-metric">
                          <Droplets size={20} />
                          <span>Water Usage: {prediction.environmental_impact.waterUsage}m³</span>
                        </div>
                        <div className="env-metric">
                          <Cloud size={20} />
                          <span>Carbon Footprint: {prediction.environmental_impact.carbonFootprint}kg CO₂</span>
                        </div>
                        <div className="env-metric">
                          <Leaf size={20} />
                          <span>Sustainability: {prediction.environmental_impact.sustainabilityScore}/100</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Sidebar (only shown when prediction exists) */}
            {prediction && (
              <div className="sidebar-column">
                <div className="ultra-sidebar">
                  <div className="sidebar-card quick-stats">
                    <h4>📊 Quick Stats</h4>
                    <div className="stats-grid">
                      <div className="stat-item">
                        <span>Crop</span>
                        <span className="stat-value">{formData.cropType}</span>
                      </div>
                      <div className="stat-item">
                        <span>Area</span>
                        <span className="stat-value">{formData.farmArea} acres</span>
                      </div>
                      <div className="stat-item">
                        <span>Season</span>
                        <span className="stat-value">{formData.season}</span>
                      </div>
                      <div className="stat-item">
                        <span>Soil Type</span>
                        <span className="stat-value">{formData.soilType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="sidebar-card ai-insights">
                    <h4>💡 AI Insights</h4>
                    <div className="tips-list">
                      {prediction.quick_tips && prediction.quick_tips.map((tip, index) => (
                        <div key={index} className="tip-item">
                          <Zap size={14} />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="sidebar-card prediction-history">
                    <h4>📈 Recent Predictions</h4>
                    <div className="history-list">
                      {predictionHistory.slice(0, 3).map((item, index) => (
                        <div key={index} className="history-item">
                          <div className="history-crop">{item.inputs.cropType}</div>
                          <div className="history-yield">{item.result.predicted_yield} tons</div>
                          <div className="history-time">{item.timestamp}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YieldPrediction;