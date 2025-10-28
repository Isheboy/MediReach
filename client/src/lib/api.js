import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post("/api/auth/register", data),
  login: (data) => api.post("/api/auth/login", data),
  logout: (data) => api.post("/api/auth/logout", data),
  getProfile: () => api.get("/api/auth/profile"),
};

// Facilities API
export const facilitiesAPI = {
  getAll: () => api.get("/api/facilities"),
  getById: (id) => api.get(`/api/facilities/${id}`),
  create: (data) => api.post("/api/facilities", data),
  update: (id, data) => api.put(`/api/facilities/${id}`, data),
};

// Appointments API
export const appointmentsAPI = {
  getAll: () => api.get("/api/appointments"),
  getById: (id) => api.get(`/api/appointments/${id}`),
  create: (data) => api.post("/api/appointments", data),
  updateStatus: (id, status) =>
    api.patch(`/api/appointments/${id}/status`, { status }),
  sendTestSMS: (id) => api.post(`/api/appointments/${id}/send-test-sms`),
};

export default api;
