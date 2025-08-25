
import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:8080', 
  baseURL:'https://certificate-request-portal-system-e01i.onrender.com/',
   withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
