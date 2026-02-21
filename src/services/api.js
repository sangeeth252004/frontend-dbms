import axios from 'axios';

// Use environment variable for API URL (set in client/.env)
// For production: REACT_APP_API_URL=https://your-render-app.onrender.com/api
// For local development: REACT_APP_API_URL=http://localhost:5000/api
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error('API Error: No response received', error.request);
    } else {
      // Error in request setup
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Students API
export const studentsAPI = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};

// Rooms API
export const roomsAPI = {
  getAll: () => api.get('/rooms'),
  getById: (id) => api.get(`/rooms/${id}`),
  create: (data) => api.post('/rooms', data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`),
};

// Allocations API
export const allocationsAPI = {
  getAll: () => api.get('/allocations'),
  getById: (id) => api.get(`/allocations/${id}`),
  getByStudent: (studentId) => api.get(`/allocations/student/${studentId}`),
  getByRoom: (roomId) => api.get(`/allocations/room/${roomId}`),
  create: (data) => api.post('/allocations', data),
  deallocate: (id, data) => api.put(`/allocations/${id}/deallocate`, data),
};

// Attendance API
export const attendanceAPI = {
  getAll: () => api.get('/attendance'),
  getByStudent: (studentId, params) => api.get(`/attendance/student/${studentId}`, { params }),
  getByDate: (date) => api.get(`/attendance/date/${date}`),
  createEntry: (data) => api.post('/attendance/entry', data),
  create: (data) => api.post('/attendance', data),
  updateExit: (id, data) => api.put(`/attendance/${id}/exit`, data),
};

// Complaints API
export const complaintsAPI = {
  getAll: () => api.get('/complaints'),
  getById: (id) => api.get(`/complaints/${id}`),
  getByStudent: (studentId) => api.get(`/complaints/student/${studentId}`),
  create: (data) => api.post('/complaints', data),
  update: (id, data) => api.put(`/complaints/${id}`, data),
  delete: (id) => api.delete(`/complaints/${id}`),
};

// Disciplinary API
export const disciplinaryAPI = {
  getAll: () => api.get('/disciplinary'),
  getById: (id) => api.get(`/disciplinary/${id}`),
  getByStudent: (studentId) => api.get(`/disciplinary/student/${studentId}`),
  create: (data) => api.post('/disciplinary', data),
  update: (id, data) => api.put(`/disciplinary/${id}`, data),
  delete: (id) => api.delete(`/disciplinary/${id}`),
};

// Maintenance API
export const maintenanceAPI = {
  getAll: () => api.get('/maintenance'),
  getById: (id) => api.get(`/maintenance/${id}`),
  getByRoom: (roomId) => api.get(`/maintenance/room/${roomId}`),
  create: (data) => api.post('/maintenance', data),
  update: (id, data) => api.put(`/maintenance/${id}`, data),
  delete: (id) => api.delete(`/maintenance/${id}`),
};

export default api;



