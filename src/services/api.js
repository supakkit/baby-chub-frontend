import axios from "axios";

// pick VITE_API_URL in dev, VITE_PUBLIC_API_URL in prod
const baseURL = import.meta.env.DEV
  // ? import.meta.env.VITE_API_URL || 'https://68996cd3fed141b96b9f74eb.mockapi.io/babychub'
  ? import.meta.env.VITE_API_URL || 'http://localhost:3100'
  : import.meta.env.VITE_PUBLIC_API_URL;

const api = axios.create({
  baseURL,
  // withCredentials: true, // critical for sending cookies!
});

export default api;