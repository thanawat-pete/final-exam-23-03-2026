import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://final-exam-23-03-2026.onrender.com/api",
  withCredentials: true, // Crucial for cookie-based auth
});

export default API;
