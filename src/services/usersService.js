import axiosClient from '../lib/axios';

export const usersService = {
  async createUser(userData) {
    try {
      const { data } = await axiosClient.post('/users', userData);
      return data;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw new Error(error.response?.data?.message || 'Error al crear usuario');
    }
  },

  async getUsers() {
    try {
      const { data } = await axiosClient.get('/users');
      return data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener usuarios');
    }
  },

  async getUserById(id) {
    try {
      const { data } = await axiosClient.get(`/users/${id}`);
      return data;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener usuario');
    }
  },

  async updateUser(id, userData) {
    try {
      const { data } = await axiosClient.put(`/users/${id}`, userData);
      return data;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw new Error(error.response?.data?.message || 'Error al actualizar usuario');
    }
  },

  async deactivateUser(id) {
    try {
      const { data } = await axiosClient.delete(`/users/${id}`);
      return data;
    } catch (error) {
      console.error('Error al desactivar usuario:', error);
      throw new Error(error.response?.data?.message || 'Error al desactivar usuario');
    }
  }
};
