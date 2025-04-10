import axiosClient from '../lib/axios';
import { AxiosError } from 'axios';

// Tipos de permisos disponibles
export type Permission = 
  | 'MANAGE_USERS'
  | 'MANAGE_ROLES'
  | 'MANAGE_TABLES'
  | 'MANAGE_CATEGORIES'
  | 'MANAGE_PRODUCTS'
  | 'MANAGE_ORDERS'
  | 'MANAGE_RESERVATIONS'
  | 'VIEW_REPORTS'
  | 'PROCESS_PAYMENTS'
  | 'KITCHEN_ACCESS';

// Interfaces para las respuestas de la API
export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface CreateRoleData {
  name: string;
  description: string;
  permissions: Permission[];
}

// Usamos type en lugar de interface para hacer explícito que es el mismo tipo
export type UpdateRoleData = CreateRoleData;

interface ApiError {
  message: string;
}

export const rolesService = {
  // Obtener todos los roles
  async getRoles(): Promise<Role[]> {
    try {
      const { data } = await axiosClient.get('/roles');
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      console.error('Error al obtener roles:', axiosError);
      throw new Error(axiosError.response?.data?.message || 'Error al obtener roles');
    }
  },

  // Obtener permisos disponibles
  async getPermissions(): Promise<Permission[]> {
    try {
      const { data } = await axiosClient.get('/roles/permissions');
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      console.error('Error al obtener permisos:', axiosError);
      throw new Error(axiosError.response?.data?.message || 'Error al obtener permisos');
    }
  },

  // Obtener rol por ID
  async getRoleById(id: number): Promise<Role> {
    try {
      const { data } = await axiosClient.get(`/roles/${id}`);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      console.error('Error al obtener rol:', axiosError);
      throw new Error(axiosError.response?.data?.message || 'Error al obtener rol');
    }
  },

  // Crear nuevo rol
  async createRole(roleData: CreateRoleData): Promise<{ message: string; role: Role }> {
    try {
      const { data } = await axiosClient.post('/roles', roleData);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      console.error('Error al crear rol:', axiosError);
      throw new Error(axiosError.response?.data?.message || 'Error al crear rol');
    }
  },

  // Actualizar rol
  async updateRole(id: number, roleData: UpdateRoleData): Promise<{ message: string; role: Role }> {
    try {
      const { data } = await axiosClient.put(`/roles/${id}`, roleData);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      console.error('Error al actualizar rol:', axiosError);
      throw new Error(axiosError.response?.data?.message || 'Error al actualizar rol');
    }
  },

  // Eliminar rol
  async deleteRole(id: number): Promise<{ message: string }> {
    try {
      const { data } = await axiosClient.delete(`/roles/${id}`);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      console.error('Error al eliminar rol:', axiosError);
      throw new Error(axiosError.response?.data?.message || 'Error al eliminar rol');
    }
  }
}; 