import { Atom, WritableAtom } from 'jotai';

// Define la estructura esperada del usuario decodificado del JWT
interface DecodedUser {
  id: string; // o number, ajusta según tu backend
  email: string;
  name: string;
  role: {
    id: string;
    name: string;
  };
  // Añade otros campos que esperes en el token, ej: roles: string[];
  iat?: number;
  exp?: number;
}

// Define los tipos para los payloads de las acciones
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterUserData {
  email: string;
  password: string;
  // Agrega aquí otros campos si son necesarios para el registro, ej: name: string;
}

// Define las acciones de autenticación usando una unión discriminada
type LoginAction = { type: 'LOGIN'; payload: LoginCredentials };
type RegisterAction = { type: 'REGISTER'; payload: RegisterUserData };
type LogoutAction = { type: 'LOGOUT' };

type AuthAction = LoginAction | RegisterAction | LogoutAction;

export const tokenAtom: WritableAtom<string | null, [string | null], void>;
export const userAtom: Atom<DecodedUser | null>;
export const isAuthenticatedAtom: Atom<boolean>;
export const authActionsAtom: WritableAtom<null, [AuthAction], Promise<boolean> | boolean>;

// Asegura que el archivo sea tratado como un módulo por TypeScript
export {};
