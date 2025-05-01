import axiosClient from '../lib/axios';
import { AxiosError } from 'axios';

// Constantes de rutas
const API_ROUTES = {
  TABLE_CATEGORIES: '/tables-categories',
  TABLES: '/tables',
  TABLES_BY_CATEGORY: '/tables/category'
} as const;

// Enums
export enum TableStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  BILL_PENDING = 'BILL_PENDING',
  DISABLED = 'DISABLED'
}

export enum TableCategoryStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

// Interfaces para Categorías
export interface TableCategory {
  id: number;
  name: string;
  description: string;
  status: TableCategoryStatus;
  createdAt: string;
  updatedAt: string;
  tables?: Table[];
}

export interface CreateTableCategoryData {
  name: string;
  description: string;
  status: TableCategoryStatus;
}

export type UpdateTableCategoryData = CreateTableCategoryData;

// Interfaces para Mesas
export interface Table {
  id: number;
  number: string;
  description: string;
  capacity: number;
  status: TableStatus;
  categoryId?: number;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: number;
    name: string;
    description: string;
  };
}

export interface CreateTableData {
  number: string;
  description: string;
  capacity: number;
  status: TableStatus;
  categoryId?: number;
}

export type UpdateTableData = CreateTableData;

interface ApiError {
  message: string;
}

// Servicio para Categorías de Mesas
export const tableCategoriesService = {
  // Obtener todas las categorías
  async getCategories(): Promise<TableCategory[]> {
    try {
      const { data } = await axiosClient.get(API_ROUTES.TABLE_CATEGORIES);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      console.error('Error al obtener categorías:', axiosError);
      throw new Error(axiosError.response?.data?.message || 'Error al obtener categorías');
    }
  },

  // Obtener categoría por ID
  async getCategoryById(id: number): Promise<TableCategory> {
    try {
      const { data } = await axiosClient.get(`${API_ROUTES.TABLE_CATEGORIES}/${id}`);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      console.error('Error al obtener categoría:', axiosError);
      throw new Error(axiosError.response?.data?.message || 'Error al obtener categoría');
    }
  },

  // Crear nueva categoría
  async createCategory(categoryData: CreateTableCategoryData): Promise<TableCategory> {
    try {
      const { data } = await axiosClient.post(API_ROUTES.TABLE_CATEGORIES, categoryData);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      console.error('Error al crear categoría:', axiosError);
      throw new Error(axiosError.response?.data?.message || 'Error al crear categoría');
    }
  },

  // Actualizar categoría
  async updateCategory(id: number, categoryData: UpdateTableCategoryData): Promise<TableCategory> {
    try {
      const { data } = await axiosClient.put(`${API_ROUTES.TABLE_CATEGORIES}/${id}`, categoryData);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      console.error('Error al actualizar categoría:', axiosError);
      throw new Error(axiosError.response?.data?.message || 'Error al actualizar categoría');
    }
  },

  // Eliminar categoría
  async deleteCategory(id: number): Promise<{ message: string }> {
    try {
      const { data } = await axiosClient.delete(`${API_ROUTES.TABLE_CATEGORIES}/${id}`);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      console.error('Error al eliminar categoría:', axiosError);
      throw new Error(axiosError.response?.data?.message || 'Error al eliminar categoría');
    }
  }
};

// Servicio para Mesas
export const tablesService = {
  // Obtener todas las mesas
  async getTables(): Promise<Table[]> {
    try {
      const url = API_ROUTES.TABLES;
      const { data } = await axiosClient.get(url);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      console.error('Error al obtener mesas:', axiosError);
      throw new Error(axiosError.response?.data?.message || 'Error al obtener mesas');
    }
  },

  // Obtener mesa por ID
  async getTableById(id: number): Promise<Table> {
    try {
      const { data } = await axiosClient.get(`${API_ROUTES.TABLES}/${id}`);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      console.error('Error al obtener mesa:', axiosError);
      throw new Error(axiosError.response?.data?.message || 'Error al obtener mesa');
    }
  },

  // Crear nueva mesa
  async createTable(tableData: CreateTableData): Promise<Table> {
    try {
      const { data } = await axiosClient.post(API_ROUTES.TABLES, tableData);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      console.error('Error al crear mesa:', axiosError);
      throw new Error(axiosError.response?.data?.message || 'Error al crear mesa');
    }
  },

  // Actualizar mesa
  async updateTable(id: number, tableData: UpdateTableData): Promise<Table> {
    try {
      const { data } = await axiosClient.put(`${API_ROUTES.TABLES}/${id}`, tableData);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      console.error('Error al actualizar mesa:', axiosError);
      throw new Error(axiosError.response?.data?.message || 'Error al actualizar mesa');
    }
  },

  // Eliminar mesa
  async deleteTable(id: number): Promise<{ message: string }> {
    try {
      const { data } = await axiosClient.delete(`${API_ROUTES.TABLES}/${id}`);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      console.error('Error al eliminar mesa:', axiosError);
      throw new Error(axiosError.response?.data?.message || 'Error al eliminar mesa');
    }
  },

  async getTablesByCategory(categoryId: number): Promise<Table[]> {
    try {
      const url = `${API_ROUTES.TABLES_BY_CATEGORY}/${categoryId}`;
      const { data } = await axiosClient.get(url);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      console.error('Error al obtener mesas por categoría:', axiosError);
      throw new Error(axiosError.response?.data?.message || 'Error al obtener mesas por categoría');
    }
  }
};

 