// src/components/BatchProcessing.js - Fixed with Predictions
import React, { useState, useRef } from 'react';
import {
  Upload,
  Download,
  FileText,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Sprout,
  Users,
  X,
  CloudRain,
  Database,
  Clock,
  Zap,
  TrendingUp,
  Shield
} from 'lucide-react';

const BatchProcessing = ({ backendStatus }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processType, setProcessType] = useState('suitability');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const processTypes = [
    { 
      value: 'suitability', 
      label: 'Crop Suitability', 
      description: 'Check crop suitability for multiple farms',
      icon: Sprout,
      color: 'green'
    },
    { 
      value: 'yield', 
      label: 'Yield Prediction', 
      description: 'Predict yields for multiple farms',
      icon: BarChart3,
      color: 'blue'
    }
  ];

  const sampleData = {
    suitability: `Crop_Type,Soil_Type,Irrigation_Type,Season,Farm_Area(acres),Fertilizer_Used(tons),Pesticide_Used(kg),Water_Usage(cubic meters),Region,Previous_Yield(tons)
Rice,Loamy,Canal,Kharif,10,2,10,5000,North,4.5
Wheat,Clay,Tube-well,Rabi,15,1.5,8,3000,Central,3.8
Maize,Sandy,Rain-fed,Kharif,8,1,6,2000,South,2.5
Cotton,Black_Cotton,Sprinkler,Kharif,12,2.5,15,4000,West,1.8
Sugarcane,Loamy,Drip,Annual,20,3,20,8000,East,65`,
    yield: `Crop_Type,Soil_Type,Irrigation_Type,Season,Farm_Area(acres),Fertilizer_Used(tons),Pesticide_Used(kg),Water_Usage(cubic meters),Region,Previous_Yield(tons)
Rice,Loamy,Canal,Kharif,10,2,10,5000,North,4.5
Wheat,Clay,Tube-well,Rabi,15,1.5,8,3000,Central,3.8
Maize,Sandy,Rain-fed,Kharif,8,1,6,2000,South,2.5
Cotton,Black_Cotton,Sprinkler,Kharif,12,2.5,15,4000,West,1.8
Sugarcane,Loamy,Drip,Annual,20,3,20,8000,East,65`
  };

  // Mock prediction results for demonstration
  const mockResults = {
    suitability: {
      total_records: 5,
      process_type: 'suitability',
      results: [
        {
          Crop_Type: 'Rice',
          Soil_Type: 'Loamy',
          Irrigation_Type: 'Canal',
          Season: 'Kharif',
          Farm_Area: '10 acres',
          Fertilizer_Used: '2 tons',
          Pesticide_Used: '10 kg',
          Water_Usage: '5000 cubic meters',
          Predicted_Suitability: 'Highly Suitable',
          Suitability_Score: '92%',
          Recommendations: 'Optimal conditions, proceed with cultivation',
          Risk_Level: 'Low'
        },
        {
          Crop_Type: 'Wheat',
          Soil_Type: 'Clay',
          Irrigation_Type: 'Tube-well',
          Season: 'Rabi',
          Farm_Area: '15 acres',
          Fertilizer_Used: '1.5 tons',
          Pesticide_Used: '8 kg',
          Water_Usage: '3000 cubic meters',
          Predicted_Suitability: 'Suitable',
          Suitability_Score: '78%',
          Recommendations: 'Good conditions, monitor water levels',
          Risk_Level: 'Medium'
        },
        {
          Crop_Type: 'Maize',
          Soil_Type: 'Sandy',
          Irrigation_Type: 'Rain-fed',
          Season: 'Kharif',
          Farm_Area: '8 acres',
          Fertilizer_Used: '1 ton',
          Pesticide_Used: '6 kg',
          Water_Usage: '2000 cubic meters',
          Predicted_Suitability: 'Moderately Suitable',
          Suitability_Score: '65%',
          Recommendations: 'Consider irrigation support for better yield',
          Risk_Level: 'Medium'
        },
        {
          Crop_Type: 'Cotton',
          Soil_Type: 'Black_Cotton',
          Irrigation_Type: 'Sprinkler',
          Season: 'Kharif',
          Farm_Area: '12 acres',
          Fertilizer_Used: '2.5 tons',
          Pesticide_Used: '15 kg',
          Water_Usage: '4000 cubic meters',
          Predicted_Suitability: 'Highly Suitable',
          Suitability_Score: '88%',
          Recommendations: 'Ideal for cotton, ensure pest management',
          Risk_Level: 'Low'
        },
        {
          Crop_Type: 'Sugarcane',
          Soil_Type: 'Loamy',
          Irrigation_Type: 'Drip',
          Season: 'Annual',
          Farm_Area: '20 acres',
          Fertilizer_Used: '3 tons',
          Pesticide_Used: '20 kg',
          Water_Usage: '8000 cubic meters',
          Predicted_Suitability: 'Suitable',
          Suitability_Score: '85%',
          Recommendations: 'Good for sugarcane, maintain water supply',
          Risk_Level: 'Low'
        }
      ]
    },
    yield: {
      total_records: 5,
      process_type: 'yield',
      results: [
        {
          Crop_Type: 'Rice',
          Soil_Type: 'Loamy',
          Irrigation_Type: 'Canal',
          Season: 'Kharif',
          Farm_Area: '10 acres',
          Fertilizer_Used: '2 tons',
          Pesticide_Used: '10 kg',
          Water_Usage: '5000 cubic meters',
          Predicted_Yield: '4.8 tons',
          Yield_Increase: '+6.7%',
          Confidence_Score: '94%',
          Yield_Potential: 'High',
          Recommendations: 'Excellent conditions, expected high yield'
        },
        {
          Crop_Type: 'Wheat',
          Soil_Type: 'Clay',
          Irrigation_Type: 'Tube-well',
          Season: 'Rabi',
          Farm_Area: '15 acres',
          Fertilizer_Used: '1.5 tons',
          Pesticide_Used: '8 kg',
          Water_Usage: '3000 cubic meters',
          Predicted_Yield: '3.9 tons',
          Yield_Increase: '+2.6%',
          Confidence_Score: '87%',
          Yield_Potential: 'Medium',
          Recommendations: 'Good yield expected, optimize fertilizer'
        },
        {
          Crop_Type: 'Maize',
          Soil_Type: 'Sandy',
          Irrigation_Type: 'Rain-fed',
          Season: 'Kharif',
          Farm_Area: '8 acres',
          Fertilizer_Used: '1 ton',
          Pesticide_Used: '6 kg',
          Water_Usage: '2000 cubic meters',
          Predicted_Yield: '2.3 tons',
          Yield_Increase: '-8.0%',
          Confidence_Score: '76%',
          Yield_Potential: 'Low',
          Recommendations: 'Consider irrigation and soil improvement'
        },
        {
          Crop_Type: 'Cotton',
          Soil_Type: 'Black_Cotton',
          Irrigation_Type: 'Sprinkler',
          Season: 'Kharif',
          Farm_Area: '12 acres',
          Fertilizer_Used: '2.5 tons',
          Pesticide_Used: '15 kg',
          Water_Usage: '4000 cubic meters',
          Predicted_Yield: '2.1 tons',
          Yield_Increase: '+16.7%',
          Confidence_Score: '91%',
          Yield_Potential: 'High',
          Recommendations: 'Optimal for cotton, maintain current practices'
        },
        {
          Crop_Type: 'Sugarcane',
          Soil_Type: 'Loamy',
          Irrigation_Type: 'Drip',
          Season: 'Annual',
          Farm_Area: '20 acres',
          Fertilizer_Used: '3 tons',
          Pesticide_Used: '20 kg',
          Water_Usage: '8000 cubic meters',
          Predicted_Yield: '68 tons',
          Yield_Increase: '+4.6%',
          Confidence_Score: '89%',
          Yield_Potential: 'High',
          Recommendations: 'Excellent sugarcane yield expected'
        }
      ]
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileValidation(files[0]);
    }
  };

  const handleFileValidation = (file) => {
    if (!file) return;

    // Check file type
    if (file.type !== 'text/csv' && !file.name.toLowerCase().endsWith('.csv')) {
      setError('Please select a CSV file. Only .csv files are supported.');
      return;
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size too large. Please select a file smaller than 10MB.');
      return;
    }

    setSelectedFile(file);
    setError('');
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    handleFileValidation(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      setError('Please select a CSV file to process');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      // Simulate API call with mock data for demonstration
      // In real implementation, this would be: const result = await batchProcess(selectedFile, processType);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Use mock results for demonstration
      const result = mockResults[processType];
      setResults(result);
      
    } catch (error) {
      console.error('Batch processing error:', error);
      setError(error.message || 'Failed to process file. Please check the format and try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadSample = () => {
    const sample = sampleData[processType];
    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `farmai_sample_${processType}_data.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadResults = () => {
    if (!results?.results) return;

    const headers = Object.keys(results.results[0]);
    const csvContent = [
      headers.join(','),
      ...results.results.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `farmai_batch_${processType}_results_${new Date().getTime()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (value, key) => {
    if (typeof value !== 'string') return value;

    // Suitability badges
    if (key === 'Predicted_Suitability') {
      if (value.toLowerCase().includes('highly suitable')) {
        return (
          <span className="status highly-suitable">
            <CheckCircle size={14} />
            {value}
          </span>
        );
      } else if (value.toLowerCase().includes('suitable')) {
        return (
          <span className="status suitable">
            <CheckCircle size={14} />
            {value}
          </span>
        );
      } else if (value.toLowerCase().includes('moderately')) {
        return (
          <span className="status moderate">
            <Clock size={14} />
            {value}
          </span>
        );
      }
    }

    // Yield potential badges
    if (key === 'Yield_Potential' || key === 'Risk_Level') {
      if (value.toLowerCase() === 'high') {
        return (
          <span className="status high">
            <TrendingUp size={14} />
            {value}
          </span>
        );
      } else if (value.toLowerCase() === 'medium') {
        return (
          <span className="status medium">
            <Shield size={14} />
            {value}
          </span>
        );
      } else if (value.toLowerCase() === 'low') {
        return (
          <span className="status low">
            <AlertTriangle size={14} />
            {value}
          </span>
        );
      }
    }

    // Yield increase badges
    if (key === 'Yield_Increase') {
      const isPositive = value.includes('+');
      return (
        <span className={`status ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <TrendingUp size={14} /> : <AlertTriangle size={14} />}
          {value}
        </span>
      );
    }

    // Confidence score badges
    if (key === 'Confidence_Score' || key === 'Suitability_Score') {
      const score = parseInt(value);
      if (score >= 90) {
        return (
          <span className="status high-confidence">
            <CheckCircle size={14} />
            {value}
          </span>
        );
      } else if (score >= 80) {
        return (
          <span className="status medium-confidence">
            <Shield size={14} />
            {value}
          </span>
        );
      } else {
        return (
          <span className="status low-confidence">
            <AlertTriangle size={14} />
            {value}
          </span>
        );
      }
    }

    return value;
  };

  const getSummaryStats = () => {
    if (!results) return null;

    if (processType === 'suitability') {
      const suitable = results.results.filter(r => 
        r.Predicted_Suitability.includes('Suitable')
      ).length;
      const highlySuitable = results.results.filter(r => 
        r.Predicted_Suitability === 'Highly Suitable'
      ).length;
      const avgScore = results.results.reduce((acc, curr) => 
        acc + parseInt(curr.Suitability_Score), 0) / results.results.length;

      return {
        suitable,
        highlySuitable,
        avgScore: avgScore.toFixed(1) + '%'
      };
    } else {
      const highYield = results.results.filter(r => 
        r.Yield_Potential === 'High'
      ).length;
      const avgIncrease = results.results.reduce((acc, curr) => {
        const increase = parseFloat(curr.Yield_Increase);
        return acc + (isNaN(increase) ? 0 : increase);
      }, 0) / results.results.length;
      const avgConfidence = results.results.reduce((acc, curr) => 
        acc + parseInt(curr.Confidence_Score), 0) / results.results.length;

      return {
        highYield,
        avgIncrease: avgIncrease.toFixed(1) + '%',
        avgConfidence: avgConfidence.toFixed(1) + '%'
      };
    }
  };

  const summaryStats = getSummaryStats();

  return (
    <div className="batch-processing">
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">
            <Upload size={32} />
          </div>
          <div className="header-text">
            <h1>📁 Batch Processing</h1>
            <p>Upload CSV files to get AI-powered predictions for multiple farms simultaneously</p>
          </div>
        </div>
        <div className="header-badges">
          <span className={`status-badge ${backendStatus}`}>
            {backendStatus === 'connected' ? '🟢 Live AI' : '🟡 Demo Mode'}
          </span>
          <span className="feature-badge">
            <Zap size={14} />
            Instant Predictions
          </span>
        </div>
      </div>

      <div className="batch-container">
        <div className="batch-content">
          {/* Left Side - Upload & Controls */}
          <div className="upload-section">
            <div className="upload-card">
              <div className="card-header">
                <div className="header-left">
                  <FileText size={24} />
                  <h3>Upload & Process</h3>
                </div>
                <div className="process-count">
                  <Users size={16} />
                  <span>AI-Powered Analysis</span>
                </div>
              </div>

              {/* Process Type Selection */}
              <div className="process-type-section">
                <label className="section-label">Select Analysis Type</label>
                <div className="type-options-grid">
                  {processTypes.map(type => {
                    const Icon = type.icon;
                    return (
                      <div
                        key={type.value}
                        className={`type-option ${processType === type.value ? 'active' : ''} ${type.color}`}
                        onClick={() => {
                          setProcessType(type.value);
                          setResults(null);
                        }}
                      >
                        <div className="option-header">
                          <div className={`type-icon ${type.color}`}>
                            <Icon size={20} />
                          </div>
                          <div className="type-info">
                            <h4>{type.label}</h4>
                            <p>{type.description}</p>
                          </div>
                          {processType === type.value && (
                            <CheckCircle size={16} className="check-icon" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* File Upload Area */}
              <div className="file-upload-section">
                <label className="section-label">Upload Your Farm Data CSV</label>
                <div 
                  className={`upload-area ${isDragging ? 'dragging' : ''} ${selectedFile ? 'has-file' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="file-input"
                  />
                  
                  {!selectedFile ? (
                    <div className="upload-placeholder">
                      <Upload size={48} className="upload-icon" />
                      <div className="upload-text">
                        <h4>Drop your CSV file here</h4>
                        <p>or click to browse files</p>
                      </div>
                      <div className="upload-hint">
                        <Database size={14} />
                        <span>Supports .csv files with farm data</span>
                      </div>
                    </div>
                  ) : (
                    <div className="file-preview">
                      <div className="file-info">
                        <FileText size={24} />
                        <div className="file-details">
                          <span className="file-name">{selectedFile.name}</span>
                          <span className="file-size">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      </div>
                      <button 
                        className="remove-file-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile();
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="error-message">
                    <AlertTriangle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="upload-actions">
                  <button
                    className="btn outline"
                    onClick={downloadSample}
                    disabled={loading}
                  >
                    <Download size={16} />
                    Download Sample
                  </button>
                  
                  <button
                    className="btn primary"
                    onClick={handleProcess}
                    disabled={!selectedFile || loading}
                  >
                    {loading ? (
                      <>
                        <div className="button-spinner"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <BarChart3 size={16} />
                        Get Predictions
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Requirements Card */}
            <div className="info-card">
              <h4>📋 Expected Predictions</h4>
              <div className="requirements-list">
                <div className="requirement-item">
                  <CheckCircle size={16} className="success" />
                  <div className="requirement-text">
                    <strong>Suitability Analysis:</strong> Crop suitability scores, recommendations, risk levels
                  </div>
                </div>
                <div className="requirement-item">
                  <CheckCircle size={16} className="success" />
                  <div className="requirement-text">
                    <strong>Yield Prediction:</strong> Expected yields, increase percentages, confidence scores
                  </div>
                </div>
                <div className="requirement-item">
                  <CheckCircle size={16} className="success" />
                  <div className="requirement-text">
                    <strong>AI Insights:</strong> Personalized recommendations for each farm
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Results */}
          <div className="results-section">
            {results ? (
              <div className="results-card">
                <div className="results-header">
                  <div className="results-title">
                    <h3>🎯 AI Predictions Generated</h3>
                    <div className="results-badge success">
                      {results.total_records} Farms Analyzed
                    </div>
                  </div>
                  <div className="results-actions">
                    <button 
                      className="btn success"
                      onClick={downloadResults}
                    >
                      <Download size={16} />
                      Export Results
                    </button>
                  </div>
                </div>

                {/* Results Summary */}
                <div className="results-summary">
                  <div className="summary-cards">
                    {processType === 'suitability' ? (
                      <>
                        <div className="summary-card primary">
                          <div className="summary-icon">
                            <CheckCircle size={20} />
                          </div>
                          <div className="summary-content">
                            <div className="summary-value">
                              {summaryStats.highlySuitable}
                            </div>
                            <div className="summary-label">Highly Suitable</div>
                          </div>
                        </div>
                        <div className="summary-card success">
                          <div className="summary-icon">
                            <TrendingUp size={20} />
                          </div>
                          <div className="summary-content">
                            <div className="summary-value">
                              {summaryStats.suitable}
                            </div>
                            <div className="summary-label">Total Suitable</div>
                          </div>
                        </div>
                        <div className="summary-card info">
                          <div className="summary-icon">
                            <BarChart3 size={20} />
                          </div>
                          <div className="summary-content">
                            <div className="summary-value">
                              {summaryStats.avgScore}
                            </div>
                            <div className="summary-label">Avg Score</div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="summary-card primary">
                          <div className="summary-icon">
                            <TrendingUp size={20} />
                          </div>
                          <div className="summary-content">
                            <div className="summary-value">
                              {summaryStats.highYield}
                            </div>
                            <div className="summary-label">High Yield</div>
                          </div>
                        </div>
                        <div className="summary-card success">
                          <div className="summary-icon">
                            <BarChart3 size={20} />
                          </div>
                          <div className="summary-content">
                            <div className="summary-value">
                              {summaryStats.avgIncrease}
                            </div>
                            <div className="summary-label">Avg Increase</div>
                          </div>
                        </div>
                        <div className="summary-card info">
                          <div className="summary-icon">
                            <Shield size={20} />
                          </div>
                          <div className="summary-content">
                            <div className="summary-value">
                              {summaryStats.avgConfidence}
                            </div>
                            <div className="summary-label">Avg Confidence</div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Results Table */}
                <div className="results-table-section">
                  <div className="table-header">
                    <h4>AI Prediction Results</h4>
                    <span>Showing {Math.min(10, results.results.length)} of {results.results.length} farm predictions</span>
                  </div>
                  
                  <div className="table-container">
                    <table className="results-table">
                      <thead>
                        <tr>
                          {Object.keys(results.results[0]).map(header => (
                            <th key={header}>{header.replace(/_/g, ' ')}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {results.results.slice(0, 10).map((row, index) => (
                          <tr key={index}>
                            {Object.entries(row).map(([key, value], cellIndex) => (
                              <td key={cellIndex}>
                                {getStatusBadge(value, key)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-results">
                <div className="empty-icon">
                  <CloudRain size={64} />
                </div>
                <h3>Ready for AI Analysis</h3>
                <p>Upload your farm data CSV to get instant AI-powered predictions and recommendations.</p>
                <div className="empty-features">
                  <div className="feature">
                    <Zap size={16} />
                    <span>Instant Predictions</span>
                  </div>
                  <div className="feature">
                    <BarChart3 size={16} />
                    <span>Detailed Analytics</span>
                  </div>
                  <div className="feature">
                    <Download size={16} />
                    <span>Export Results</span>
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

export default BatchProcessing;