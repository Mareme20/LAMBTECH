import axios from 'axios';

const envApi = import.meta.env.VITE_API_URL;
let API_URL: string | undefined = envApi;
if (!API_URL && typeof window !== 'undefined') {
  const host = window.location.hostname;
  API_URL = host === 'localhost' || host === '127.0.0.1' ? 'http://localhost:5000/api' : `${window.location.origin}/api`;
}

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
