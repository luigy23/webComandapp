import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import * as jwtDecode from 'jwt-decode';
import { authService } from '../services/authService';

// Átomo para el token JWT
export const tokenAtom = atomWithStorage('token', null);

// Átomo para el usuario decodificado
export const userAtom = atom(
  (get) => {
    const token = get(tokenAtom);
    if (!token) return null;
    try {
      return jwtDecode.jwtDecode(token);
    } catch {
      return null;
    }
  }
);

// Átomo para el estado de autenticación
export const isAuthenticatedAtom = atom(
  (get) => !!get(tokenAtom)
);

// Átomos derivados para las acciones de autenticación
export const authActionsAtom = atom(
  null,
  async (get, set, { type, payload }) => {
    switch (type) {
      case 'LOGIN':
        try {
          const data = await authService.login(payload);
          set(tokenAtom, data.token);
          return true;
        } catch (error) {
          console.error('Error en login:', error);
          return false;
        }

      case 'REGISTER':
        try {
          const data = await authService.register(payload);
          set(tokenAtom, data.token);
          return true;
        } catch (error) {
          console.error('Error en registro:', error);
          return false;
        }

      case 'LOGOUT':
        set(tokenAtom, null);
        return true;

      default:
        throw new Error('Acción no soportada');
    }
  }
); 