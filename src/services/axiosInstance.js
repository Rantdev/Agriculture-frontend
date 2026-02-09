// frontend/src/services/axiosInstance.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://agriculture-backend-o46d.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Call: ${config.method?.toUpperCase()} ${config.url}`);
    // Add token to Authorization header if available
    const token = localStorage.getItem('token');
    if (token) {
      console.log(`📝 Token found, adding to request: ${token.substring(0, 20)}...`);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log(`⚠️  No token in localStorage`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response successful:`, response.status);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const errorData = error.response?.data;
    
    console.error(`❌ API Error ${status}`);
    console.error(`   URL: ${error.config?.url}`);
    console.error(`   Response:`, errorData);
    
    if (status === 401) {
      console.error(`   Message: ${errorData?.error || 'Unauthorized'}`);
      // Optionally clear token on 401
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } else if (status === 400) {
      console.error(`   Validation Error: ${errorData?.error}`);
    } else if (status === 409) {
      console.error(`   Conflict: ${errorData?.error}`);
    } else if (status === 500) {
      console.error(`   Server Error: ${errorData?.error}`);
    } else if (error.message === 'Network Error') {
      console.error(`   Backend not accessible`);
    }
    
    return Promise.reject(error);
  }
);

export default api;
