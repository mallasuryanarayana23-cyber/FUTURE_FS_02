import axios from 'axios';

// Determine API base URL - works for local dev and Vercel production
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    // Strip trailing slash, then ensure it ends with /api
    const stripped = envUrl.replace(/\/$/, '');
    return stripped.endsWith('/api') ? stripped : `${stripped}/api`;
  }
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
});

// Add a request interceptor to add the JWT token to headers
api.interceptors.request.use(
  (config) => {
    const admin = JSON.parse(localStorage.getItem('admin'));
    if (admin && admin.token) {
      config.headers.Authorization = `Bearer ${admin.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle global errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('admin');
      // Force redirect to login page if session is invalid, unless already on landing or login page
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
