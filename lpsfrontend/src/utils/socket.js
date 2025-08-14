import { io } from "socket.io-client";

// Vite exposes env variables as import.meta.env
const backendUrl = import.meta.env.VITE_BACKEND_URI;

export const socket = io(backendUrl);

// To use BACKEND_URI, add it to your .env file as VITE_BACKEND_URI
// Example: VITE_BACKEND_URI=http://localhost:3000 