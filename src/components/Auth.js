// src/components/Auth.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import '../styles/Auth.css';

const Auth = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = isLogin
        ? '/api/auth/login'
        : '/api/auth/register';

      const payload = isLogin
        ? {
            username: formData.username,
            password: formData.password,
          }
        : {
            username: formData.username,
            password: formData.password,
            email: formData.email,
          };

      const response = await fetch(`http://localhost:8000${endpoint}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});
 

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || data.error || 'Authentication failed');
        setLoading(false);
        return;
      }

      // ✅ Store token and user data for persistent login
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      localStorage.setItem('user', JSON.stringify(data.user || data));

      // Tell App.js that login succeeded (to update isAuthenticated state)
      if (onLoginSuccess) {
        onLoginSuccess();
      }

      setSuccess(data.message || 'Success!');
      setTimeout(() => {
        // after login go to main user dashboard
        navigate('/dashboard');
      }, 800);
    } catch (err) {
      setError(
        err.message ||
          'Connection error. Ensure backend is running on http://localhost:8000'
      );
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🌾 FarmAI</h1>
          <p>{isLogin ? 'Welcome Back' : 'Join Our Farming Community'}</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <div className="input-wrapper">
              <User size={20} />
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
                minLength={3}
                disabled={loading}
              />
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Email</label>
              <div className="input-wrapper">
                <Mail size={20} />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-auth"
            disabled={loading}
          >
            {loading
              ? 'Processing...'
              : isLogin
              ? 'Login'
              : 'Sign Up'}
          </button>
        </form>

        <div className="auth-toggle">
          <p>
            {isLogin
              ? "Don't have an account? "
              : 'Already have an account? '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ username: '', password: '', email: '' });
                setError('');
                setSuccess('');
              }}
              className="toggle-link"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>

        <div className="auth-footer">
          <p>🔒 Your data is secure and encrypted</p>
        </div>
      </div>
      
    </div>
  );
};

export default Auth;
