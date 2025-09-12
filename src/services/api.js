import axios from "axios";

// pick VITE_API_URL in dev, VITE_PUBLIC_API_URL in prod
const baseURL = import.meta.env.DEV
  ? import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'
  : import.meta.env.VITE_PUBLIC_API_URL;

const api = axios.create({
  baseURL,
  // withCredentials: true, // critical for sending cookies!
});

export default api;