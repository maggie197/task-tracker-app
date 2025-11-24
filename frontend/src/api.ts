import axios from 'axios';
import { Task, CreateTaskDto, UpdateTaskDto } from './types';

// Base URL for API - change this if backend runs on different port
const API_BASE_URL = 'http://localhost:3001/api';

// Axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service with all CRUD operations
// This abstracts away the HTTP details from our components
export const taskService = {
  // GET all tasks
  getAllTasks: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  },

  // GET single task by ID
  getTaskById: async (id: string): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  // POST create new task
  createTask: async (data: CreateTaskDto): Promise<Task> => {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
  },

  // PUT update existing task
  updateTask: async (id: string, data: UpdateTaskDto): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  // DELETE task
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  // PATCH toggle task status
  toggleTaskStatus: async (id: string): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${id}/toggle`);
    return response.data;
  },
};