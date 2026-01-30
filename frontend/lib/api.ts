import axios from 'axios';
import type { ParsedRaceEmail, RacerStats } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Race API calls
export const racesApi = {
  getAll: async (params?: {
    location?: string;
    racerName?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<ParsedRaceEmail[]>> => {
    const response = await api.get('/api/races', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<ParsedRaceEmail>> => {
    const response = await api.get(`/api/races/${id}`);
    return response.data;
  },

  getLocations: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get('/api/races/locations');
    return response.data;
  },

  getTracks: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get('/api/races/tracks');
    return response.data;
  },

  refresh: async (): Promise<ApiResponse<{ count: number }>> => {
    const response = await api.post('/api/races/refresh');
    return response.data;
  },
};

// Racer API calls
export const racersApi = {
  getAll: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get('/api/racers');
    return response.data;
  },

  getStats: async (name: string): Promise<ApiResponse<RacerStats>> => {
    const response = await api.get(`/api/racers/${encodeURIComponent(name)}`);
    return response.data;
  },
};

export default api;
