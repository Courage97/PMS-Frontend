import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const response = await axios.post(`${BASE_URL}/token/refresh/`, {
            refresh
          });
          localStorage.setItem('access_token', response.data.access);
          error.config.headers.Authorization = `Bearer ${response.data.access}`;
          return axios(error.config);
        } catch {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  async register(userData) {
    const response = await api.post('/register/', userData);
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/token/', credentials);
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    return response.data;
  },

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }
};

export default api; 