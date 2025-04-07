import axiosClient from '../lib/axios';

export const authService = {
    
  async login(credentials) {
    try {
      const { data } = await axiosClient.post('/auth/login', credentials);
      return data;
    } catch (error) {
      console.error('Error en el servicio de login:', error);
      throw new Error(error.response?.data?.error || 'Error al iniciar sesión');
    }
  },

  async register(userData) {
    try {
      const { data } = await axiosClient.post('/auth/register', userData);
      return data;
    } catch (error) {
      console.error('Error en el servicio de registro:', error);
      throw new Error(error.response?.data?.error || 'Error al registrar usuario');
    }
  },
}; 