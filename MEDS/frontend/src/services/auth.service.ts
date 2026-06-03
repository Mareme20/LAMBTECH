import apiClient from '../api/client';
import type { AuthResponse, User } from '../types';

export const AuthService = {
  login: async (email: string, motDePasse: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', { email, motDePasse });
    return response.data;
  },

  register: async (userData: Partial<User> & { motDePasse: string }): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },

  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/auth/users');
    return response.data;
  },

  toggleUserStatus: async (id: number): Promise<void> => {
    await apiClient.put(`/auth/users/${id}/toggle-status`);
  },
};
