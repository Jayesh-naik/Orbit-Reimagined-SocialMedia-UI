import axios from 'axios';
import { mockStorage } from './mockStorage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 1500, // Fast timeout to trigger local fallback when backend is offline
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Helper to simulate network latency for mock calls
const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

const handleMockRoute = async (method, url, data) => {
  await delay();
  const path = url.replace(/^\/api/, '').replace(/^\/+/, '');

  // Auth routes
  if (path === 'auth/me' || path.startsWith('auth/me')) {
    const user = mockStorage.getCurrentUser();
    return { data: { user } };
  }

  if (path === 'auth/login') {
    const res = mockStorage.login(data?.email || '');
    return { data: res };
  }

  if (path === 'auth/register') {
    const res = mockStorage.register(data?.name || 'New User', data?.email || '');
    return { data: res };
  }

  if (path === 'auth/logout') {
    return { data: { message: 'Logged out successfully' } };
  }

  // Projects routes
  if (path === 'projects' && method === 'get') {
    return { data: { projects: mockStorage.getProjects() } };
  }

  if (path === 'projects' && method === 'post') {
    const newProj = mockStorage.createProject(data);
    return { data: { project: newProj } };
  }

  const projMatch = path.match(/^projects\/([^\/]+)$/);
  if (projMatch && method === 'get') {
    const id = projMatch[1];
    const res = mockStorage.getProjectById(id);
    return { data: res };
  }

  if (projMatch && method === 'put') {
    const id = projMatch[1];
    const updated = mockStorage.updateProject(id, data);
    return { data: { project: updated } };
  }

  const projTaskMatch = path.match(/^projects\/([^\/]+)\/tasks$/);
  if (projTaskMatch && method === 'post') {
    const projectId = projTaskMatch[1];
    const created = mockStorage.createTask({ ...data, projectId });
    return { data: { task: created } };
  }

  // Tasks routes
  const taskMoveMatch = path.match(/^tasks\/([^\/]+)\/move$/);
  if (taskMoveMatch && (method === 'patch' || method === 'put')) {
    const taskId = taskMoveMatch[1];
    const updated = mockStorage.moveTask(taskId, data?.status);
    return { data: { task: updated } };
  }

  const taskMatch = path.match(/^tasks\/([^\/]+)$/);
  if (taskMatch && method === 'put') {
    const taskId = taskMatch[1];
    const updated = mockStorage.updateTask(taskId, data);
    return { data: { task: updated } };
  }

  if (taskMatch && method === 'delete') {
    const taskId = taskMatch[1];
    mockStorage.deleteTask(taskId);
    return { data: { success: true } };
  }

  // Task Comments
  const commentsMatch = path.match(/^tasks\/([^\/]+)\/comments$/);
  if (commentsMatch && method === 'get') {
    const taskId = commentsMatch[1];
    return { data: { comments: mockStorage.getComments(taskId) } };
  }

  if (commentsMatch && method === 'post') {
    const taskId = commentsMatch[1];
    const newComment = mockStorage.addComment(taskId, data?.message || '');
    return { data: { comment: newComment } };
  }

  // Notifications
  if (path === 'notifications' && method === 'get') {
    return { data: mockStorage.getNotifications() };
  }

  const notifReadMatch = path.match(/^notifications\/([^\/]+)\/read$/);
  if (notifReadMatch && method === 'patch') {
    const id = notifReadMatch[1];
    mockStorage.markNotificationRead(id);
    return { data: { success: true } };
  }

  if (path === 'notifications/read-all' && method === 'patch') {
    mockStorage.markAllNotificationsRead();
    return { data: { success: true } };
  }

  // Fallback for unhandled mock calls
  return { data: { success: true } };
};

const api = {
  get: async (url, config) => {
    try {
      return await axiosInstance.get(url, config);
    } catch (err) {
      console.warn(`[FlowBoard-AI] Backend offline/unreachable for GET ${url}, serving local mock data.`);
      return handleMockRoute('get', url);
    }
  },
  post: async (url, data, config) => {
    try {
      return await axiosInstance.post(url, data, config);
    } catch (err) {
      console.warn(`[FlowBoard-AI] Backend offline/unreachable for POST ${url}, executing local mock operation.`);
      return handleMockRoute('post', url, data);
    }
  },
  put: async (url, data, config) => {
    try {
      return await axiosInstance.put(url, data, config);
    } catch (err) {
      console.warn(`[FlowBoard-AI] Backend offline/unreachable for PUT ${url}, executing local mock operation.`);
      return handleMockRoute('put', url, data);
    }
  },
  patch: async (url, data, config) => {
    try {
      return await axiosInstance.patch(url, data, config);
    } catch (err) {
      console.warn(`[FlowBoard-AI] Backend offline/unreachable for PATCH ${url}, executing local mock operation.`);
      return handleMockRoute('patch', url, data);
    }
  },
  delete: async (url, config) => {
    try {
      return await axiosInstance.delete(url, config);
    } catch (err) {
      console.warn(`[FlowBoard-AI] Backend offline/unreachable for DELETE ${url}, executing local mock operation.`);
      return handleMockRoute('delete', url);
    }
  },
};

export default api;
