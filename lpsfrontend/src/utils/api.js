import axios from "axios";

// Vite exposes env variables as import.meta.env
const baseURL = import.meta.env.VITE_BACKEND_URI;

export const api = axios.create({
  baseURL,
});

// To use BACKEND_URI, add it to your .env file as VITE_BACKEND_URI
// Example: VITE_BACKEND_URI=http://localhost:3000 