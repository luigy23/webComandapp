import axiosClient from '../lib/axios';
import { AxiosError } from 'axios';

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: {
    name: string;
  };
  isActive: boolean;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  roleId: number;
}

export interface UpdateUserData extends Partial<CreateUserData> {
  isActive?: boolean;
}

interface ApiError {
  message: string;
}

export const usersService = {
  async createUser(userData: CreateUserData): Promise<{ message: string; user: UserResponse }> {
    try {
      const { data } = await axiosClient.post('/users', userData);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      console.error('Error al crear usuario:', axiosError);
      throw new Error(axiosError.response?.data?.message || 'Error al crear usuario');
    }
  },

  async getUsers(): Promise<UserResponse[]> {
    try {
      const { data } = await axiosClient.get('/users');
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      console.error('Error al obtener usuarios:', axiosError);
      throw new Error(axiosError.response?.data?.message || 'Error al obtener usuarios');
    }
  },

  async getUserById(id: number): Promise<UserResponse> {
    try {
      const { data } = await axiosClient.get(`/users/${id}`);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      console.error('Error al obtener usuario:', axiosError);
      throw new Error(axiosError.response?.data?.message || 'Error al obtener usuario');
    }
  },

  async updateUser(id: number, userData: UpdateUserData): Promise<{ message: string; user: UserResponse }> {
    try {
      const { data } = await axiosClient.put(`/users/${id}`, userData);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      console.error('Error al actualizar usuario:', axiosError);
      throw new Error(axiosError.response?.data?.message || 'Error al actualizar usuario');
    }
  },

  async deactivateUser(id: number): Promise<{ message: string }> {
    try {
      const { data } = await axiosClient.delete(`/users/${id}`);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      console.error('Error al desactivar usuario:', axiosError);
      throw new Error(axiosError.response?.data?.message || 'Error al desactivar usuario');
    }
  }
}; 