import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // Timeout de 5 segundos
  withCredentials: true // Habilitar el envío de credenciales en peticiones cross-origin
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Limpiamos el token de comillas extras
      const cleanToken = token.replace(/^"|"$/g, '');
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    return config;
  },
  (error) => {
    console.error('Error en la petición:', error);
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Error de red o servidor no disponible
    if (!error.response) {
      console.error('Error de conectividad:', error.message);
      return Promise.reject(new Error('No se puede conectar con el servidor'));
    }

    // Error de autenticación
    if (error.response.status === 401) {
      localStorage.removeItem('token');
     
    }

    // Otros errores
    console.error('Error en la respuesta:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient; 