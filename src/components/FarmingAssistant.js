// src/components/FarmingAssistant.js - Fixed Version
import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  User,
  Sprout,
  Droplets,
  Shield,
  TrendingUp,
  Zap,
  BookOpen,
  Lightbulb,
  ThumbsUp,
  Search
} from 'lucide-react';
import { chatWithAssistant, getCropDatabase } from '../services/api';

const FarmingAssistant = ({ backendStatus }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m your AI farming assistant 🌾. I can help you with crop selection, soil management, irrigation, pest control, market trends, and much more. What would you like to know about farming today?',
      timestamp: new Date(),
      type: 'welcome'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [cropDatabase, setCropDatabase] = useState({});
  const [responseSource, setResponseSource] = useState(null);
  const messagesEndRef = useRef(null);

  // Enhanced quick questions with categories
  const quickQuestions = [
    {
      category: 'Crop Selection',
      questions: [
        "What crops grow best in clay soil during monsoon?",
        "Which vegetables have high market demand?",
        "Best crops for organic farming?"
      ]
    },
    {
      category: 'Soil & Fertilizer',
      questions: [
        "How to improve soil fertility naturally?",
        "When to use organic vs chemical fertilizers?",
        "Soil testing methods and benefits"
      ]
    },
    {
      category: 'Water Management',
      questions: [
        "Drip irrigation setup cost and benefits",
        "Water-saving techniques for dry regions",
        "Rainwater harvesting for farms"
      ]
    },
    {
      category: 'Pest & Disease',
      questions: [
        "Natural pest control methods",
        "Identifying common crop diseases",
        "Integrated Pest Management (IPM) guide"
      ]
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    loadCropDatabase();
    generateSuggestedQuestions();
  },[generateSuggestedQuestions]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadCropDatabase = async () => {
    try {
      const data = await getCropDatabase();
      setCropDatabase(data);
    } catch (error) {
      console.error('Error loading crop database:', error);
    }
  };

  const generateSuggestedQuestions = () => {
    const questions = [];
    quickQuestions.forEach(category => {
      questions.push(...category.questions.slice(0, 2));
    });
    setSuggestedQuestions(questions.sort(() => 0.5 - Math.random()).slice(0, 6));
  };

  // in FarmingAssistant.js (replace existing handleSendMessage)
const handleSendMessage = async (e) => {
  e.preventDefault();
  if (!inputMessage.trim() || loading) return;

  const userMessage = {
    id: Date.now(),
    role: 'user',
    content: inputMessage,
    timestamp: new Date(),
    type: 'text'
  };

  setMessages(prev => [...prev, userMessage]);
  setInputMessage('');
  setLoading(true);

  try {
    const result = await chatWithAssistant(userMessage.content); // will call Gemini
    if (result && result.success) {
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: result.response,
        timestamp: new Date(),
        type: 'text',
        source: result.source || 'google-ai'
      };
      setMessages(prev => [...prev, assistantMessage]);
      setResponseSource(assistantMessage.source);
    } else {
      // handle unexpected shape
      const fallback = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I'm sorry — couldn't get an AI response right now.",
        timestamp: new Date(),
        type: 'text',
        source: 'error'
      };
      setMessages(prev => [...prev, fallback]);
      setResponseSource('error');
    }
  } catch (err) {
    console.error("Chat error:", err);
    const errorMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: "I couldn't reach the AI service. Please try again later.",
      timestamp: new Date(),
      type: 'error',
      source: 'error'
    };
    setMessages(prev => [...prev, errorMessage]);
    setResponseSource('error');
  } finally {
    setLoading(false);
  }
};


  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  const formatMessage = (content) => {
    if (!content) return <div className="message-line">No response received.</div>;
    
    // Split by numbered points and bullet points
    const lines = content.split('\n').filter(line => line.trim());
    
    return lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      // Check for numbered points (1., 2., etc.)
      if (/^\d+\./.test(trimmedLine)) {
        return (
          <div key={index} className="message-point numbered">
            <span className="point-number">{trimmedLine.match(/^\d+/)[0]}</span>
            <span className="point-text">{trimmedLine.replace(/^\d+\.\s*/, '')}</span>
          </div>
        );
      }
      
      // Check for bullet points
      if (/^[•\-*]/.test(trimmedLine)) {
        return (
          <div key={index} className="message-point bullet">
            <span className="bullet-point">•</span>
            <span className="point-text">{trimmedLine.replace(/^[•\-*]\s*/, '')}</span>
          </div>
        );
      }
      
      // Check for bold text with **
      if (/\*\*(.*?)\*\*/.test(trimmedLine)) {
        const parts = trimmedLine.split(/\*\*(.*?)\*\*/);
        return (
          <div key={index} className="message-line">
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
            )}
          </div>
        );
      }
      
      // Regular text with emoji support
      return (
        <div key={index} className="message-line">
          {trimmedLine}
        </div>
      );
    });
  };

  const getSourceDisplay = (source) => {
    switch (source) {
      case 'google-ai':
        return { text: 'Powered by Google AI', color: 'google' };
      case 'enhanced-mock':
        return { text: 'Expert Farming Database', color: 'expert' };
      case 'fallback-mock':
        return { text: 'Basic Assistant', color: 'basic' };
      case 'error':
        return { text: 'Service Temporarily Unavailable', color: 'error' };
      default:
        return { text: 'AI Assistant', color: 'default' };
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: 'Hello! I\'m your AI farming assistant 🌾. How can I help you with your farming today?',
        timestamp: new Date(),
        type: 'welcome'
      }
    ]);
    setResponseSource(null);
  };

  return (
    <div className="farming-assistant">
      <div className="page-header">
        <div className="header-icon">
          <Bot size={32} />
        </div>
        <div className="header-content">
          <h1>🤖 AI Farming Assistant</h1>
          <p>Get intelligent, personalized farming advice powered by Google AI and agricultural expertise</p>
        </div>
        <div className="header-badge">
          <span className={`status-badge ${backendStatus}`}>
            {backendStatus === 'connected' ? '🤖 AI Powered' : '💡 Demo Mode'}
          </span>
        </div>
      </div>

      <div className="assistant-container">
        <div className="chat-container">
          {/* Response Source Indicator */}
          {responseSource && (
            <div className="response-source-indicator">
              <div className={`source-badge ${getSourceDisplay(responseSource).color}`}>
                {getSourceDisplay(responseSource).text}
              </div>
            </div>
          )}

          {/* Welcome Section */}
          {messages.length === 1 && (
            <div className="welcome-section">
              <div className="welcome-card">
                <div className="welcome-icon">
                  <Zap size={48} />
                </div>
                <h2>How can I help you today?</h2>
                <p>I'm your AI farming expert, here to provide personalized advice for your agricultural needs.</p>
                
                <div className="capabilities-grid">
                  <div className="capability-item">
                    <Sprout size={20} />
                    <span>Crop Selection</span>
                  </div>
                  <div className="capability-item">
                    <Droplets size={20} />
                    <span>Water Management</span>
                  </div>
                  <div className="capability-item">
                    <Shield size={20} />
                    <span>Pest Control</span>
                  </div>
                  <div className="capability-item">
                    <TrendingUp size={20} />
                    <span>Market Advice</span>
                  </div>
                  <div className="capability-item">
                    <BookOpen size={20} />
                    <span>Best Practices</span>
                  </div>
                  <div className="capability-item">
                    <Lightbulb size={20} />
                    <span>Innovations</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Suggested Questions */}
          {suggestedQuestions.length > 0 && messages.length === 1 && (
            <div className="suggested-questions">
              <h4>💡 Popular Questions</h4>
              <div className="questions-grid">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="question-chip"
                    onClick={() => handleQuickQuestion(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.role} ${message.type}`}
              >
                <div className="message-avatar">
                  {message.role === 'user' ? (
                    <div className="avatar-user">
                      <User size={18} />
                    </div>
                  ) : (
                    <div className="avatar-assistant">
                      <Bot size={18} />
                    </div>
                  )}
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-sender">
                      {message.role === 'user' ? 'You' : 'FarmAI Assistant'}
                    </span>
                    <span className="message-time">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <div className="message-text">
                    {formatMessage(message.content)}
                  </div>
                  
                  {/* Show response source for assistant messages */}
                  {message.role === 'assistant' && message.source && message.type !== 'welcome' && (
                    <div className="message-source">
                      <span className={`source-tag ${getSourceDisplay(message.source).color}`}>
                        {getSourceDisplay(message.source).text}
                      </span>
                    </div>
                  )}
                  
                  {message.role === 'assistant' && message.type !== 'welcome' && (
                    <div className="message-actions">
                      <button className="action-btn">
                        <ThumbsUp size={14} />
                        Helpful
                      </button>
                      <button className="action-btn">
                        <Lightbulb size={14} />
                        More Details
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="message assistant typing">
                <div className="message-avatar">
                  <div className="avatar-assistant">
                    <Bot size={18} />
                  </div>
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-sender">FarmAI Assistant</span>
                  </div>
                  <div className="message-text">
                    <div className="typing-indicator">
                      <span>Analyzing your question</span>
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Question Categories */}
          {messages.length > 1 && (
            <div className="quick-categories">
              <h5>Quick Help</h5>
              <div className="category-chips">
                {quickQuestions.map((category, index) => (
                  <div key={index} className="category-group">
                    <span className="category-label">{category.category}:</span>
                    <div className="category-questions">
                      {category.questions.slice(0, 2).map((question, qIndex) => (
                        <button
                          key={qIndex}
                          className="question-chip small"
                          onClick={() => handleQuickQuestion(question)}
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input */}
          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <div className="input-container">
              <div className="input-icon">
                <Search size={20} />
              </div>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about crops, soil, irrigation, market prices, or any farming topic..."
                disabled={loading}
                className="chat-input"
              />
              <div className="input-actions">
                {messages.length > 1 && (
                  <button 
                    type="button" 
                    className="clear-btn"
                    onClick={clearChat}
                    title="Clear conversation"
                  >
                    Clear
                  </button>
                )}
                <button 
                  type="submit" 
                  disabled={!inputMessage.trim() || loading}
                  className="send-button"
                  title="Send message"
                >
                  {loading ? (
                    <div className="send-spinner"></div>
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </div>
            </div>
            <div className="input-hint">
              💡 Try asking about specific crops, soil types, or farming challenges
            </div>
          </form>
        </div>

        {/* Enhanced Assistant Info Panel */}
        <div className="assistant-info">
          <div className="info-card">
            <div className="info-header">
              <Zap size={24} />
              <h3>AI-Powered Insights</h3>
            </div>
            <div className="info-content">
              <p>Get real-time, intelligent farming advice powered by Google's Gemini AI and agricultural databases.</p>
              <div className="feature-list">
                <div className="feature-item">
                  <div className="feature-icon">🌱</div>
                  <div className="feature-text">
                    <strong>Smart Crop Recommendations</strong>
                    <span>Based on soil, weather, and market data</span>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">💧</div>
                  <div className="feature-text">
                    <strong>Water Management</strong>
                    <span>Optimized irrigation schedules</span>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🐛</div>
                  <div className="feature-text">
                    <strong>Pest Solutions</strong>
                    <span>Natural and chemical control methods</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="info-card">
            <div className="info-header">
              <Lightbulb size={24} />
              <h3>Pro Tips</h3>
            </div>
            <div className="tips-list">
              <div className="tip-item">
                <div className="tip-icon">🎯</div>
                <div className="tip-content">
                  <strong>Be specific</strong>
                  <span>Include your location, soil type, and season for better advice</span>
                </div>
              </div>
              <div className="tip-item">
                <div className="tip-icon">📸</div>
                <div className="tip-content">
                  <strong>Upload images</strong>
                  <span>Share photos of crops or soil for visual analysis</span>
                </div>
              </div>
              <div className="tip-item">
                <div className="tip-icon">💬</div>
                <div className="tip-content">
                  <strong>Ask follow-ups</strong>
                  <span>I can provide step-by-step guidance for complex issues</span>
                </div>
              </div>
            </div>
          </div>

          <div className="info-card status-card">
            <div className="info-header">
              <div className={`status-indicator ${backendStatus}`}></div>
              <h3>AI Status</h3>
            </div>
            <div className="status-info">
              <div className="status-item">
                <span className="status-label">AI Engine:</span>
                <span className="status-value">
                  {backendStatus === 'connected' ? 'Google Gemini Pro' : 'Enhanced Local Database'}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Response Quality:</span>
                <span className="status-value">
                  {backendStatus === 'connected' ? 'Real-time AI' : 'Expert Knowledge'}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Knowledge Base:</span>
                <span className="status-value">
                  Comprehensive Farming Database
                </span>
              </div>
            </div>
          </div>

          {/* Crop Quick Reference */}
          <div className="info-card">
            <div className="info-header">
              <Sprout size={24} />
              <h3>Quick Crop Reference</h3>
            </div>
            <div className="crop-reference">
              {Object.entries(cropDatabase).slice(0, 4).map(([crop, data]) => (
                <div key={crop} className="crop-item">
                  <span className="crop-name">{crop}</span>
                  <span className="crop-details">
                    {data.season} • {data.water_need} Water
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmingAssistant;