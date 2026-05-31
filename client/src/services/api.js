// services/api.js — Axios wrapper for all API calls
import axios from 'axios';

// Auth APIs
export const authAPI = {
  register: (data) => axios.post('/auth/register', data),
  login: (data) => axios.post('/auth/login', data),
  getMe: () => axios.get('/auth/me'),
  updateProfile: (data) => axios.put('/auth/profile', data),
};

// Course APIs
export const courseAPI = {
  getAll: (params) => axios.get('/courses', { params }),
  getById: (id) => axios.get(`/courses/${id}`),
  getFeatured: () => axios.get('/courses/featured'),
  create: (data) => axios.post('/courses', data),
};

// Enrollment APIs
export const enrollmentAPI = {
  enroll: (courseId) => axios.post(`/enroll/${courseId}`),
  getMyEnrollments: () => axios.get('/enroll/my'),
  checkEnrollment: (courseId) => axios.get(`/enroll/check/${courseId}`),
  unenroll: (courseId) => axios.delete(`/enroll/${courseId}`),
};

// Progress APIs
export const progressAPI = {
  getAll: () => axios.get('/progress/my'),
  getByCourse: (courseId) => axios.get(`/progress/${courseId}`),
  update: (courseId, data) => axios.put(`/progress/${courseId}`, data),
};

// Recommendation API
export const recommendAPI = {
  get: () => axios.get('/recommend'),
};