import { useAtom, useAtomValue } from 'jotai';
import { userAtom, isAuthenticatedAtom, authActionsAtom } from '../store/auth';
import { useEffect, useState } from 'react';

// Definir tipos para los parámetros
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterUserData {
  email: string;
  password: string;
  // Agrega aquí otros campos si son necesarios para el registro, ej: name: string;
}

export const useAuth = () => {
  const user = useAtomValue(userAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const [, dispatch] = useAtom(authActionsAtom);
  const [isInitialized, setIsInitialized] = useState(() => {
    // Inicializamos inmediatamente si no hay token
    const token = localStorage.getItem('token');
    return !token;
  });

  useEffect(() => {
    // Solo esperamos el user si hay token
    if (localStorage.getItem('token')) {
      if (user) {
        setIsInitialized(true);
      }
    }
  }, [user]);

  const login = async (credentials: LoginCredentials) => {
    return dispatch({ type: 'LOGIN', payload: credentials });
  };

  const register = async (userData: RegisterUserData) => {
    return dispatch({ type: 'REGISTER', payload: userData });
  };

  const logout = async () => {
    return dispatch({ type: 'LOGOUT' });
  };

  return {
    user,
    isAuthenticated,
    isInitialized,
    login,
    logout,
    register
  };
}; 