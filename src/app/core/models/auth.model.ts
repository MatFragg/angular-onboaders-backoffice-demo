/**
 * Authentication Models
 */

// Login request DTO
export interface LoginRequest {
  email: string;
  password: string;
}

// Register request DTO
export type TipoUsuario = 'SUPERADMIN' | 'ADMIN' | 'USER';

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  dni: string;
  ruc: string;
  activo: boolean;
  tipoUsuario: TipoUsuario;
}

// Auth response DTO (from /api/auth/login and /api/auth/register)
export interface AuthResponse {
  id: number;
  email: string;
  token: string | null;
}

// Current user info (decoded from token or stored)
export interface CurrentUser {
  id: number;
  email: string;
  nombre?: string;
  roles?: string[];
}
