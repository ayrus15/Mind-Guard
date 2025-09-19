import api from './api';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  async getMe(): Promise<{ user: User }> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};