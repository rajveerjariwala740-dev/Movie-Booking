import axios from 'axios';

// Backend logic usually runs on port 3000 as per common Express setup or process.env.PORT
// Assuming 3000 for standard local dev backend
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to automatically attach the JWT token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
