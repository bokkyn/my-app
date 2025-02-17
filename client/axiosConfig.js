import axios from 'axios';

// Kreiramo instancu Axios-a s interceptorom koji dodaje token u svaki zahtjev
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // Vaš backend URL
});

// Interceptor koji dodaje Authorization header s tokenom
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');  // Dohvaćanje tokena iz localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;  // Dodavanje tokena u zaglavlje
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
