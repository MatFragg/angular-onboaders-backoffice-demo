/**
 * Authentication Models
 */

// Login request DTO
export interface LoginRequest {
  acjMail: string;
  password: string;
}

// Register request DTO
export type TipoUsuario = 'ADMIN' | 'CORRIENTE';
export type SubRol = 'OBSERVADOR' | 'RESOLUTOR';

export interface RegisterRequest {
  nombre: string;
  acjMail: string;
  password: string;
  activo: boolean;
  tipoUsuario: TipoUsuario;
  subRol?: SubRol; // Only required when tipoUsuario is CORRIENTE
}

// Auth response DTO (from /api/auth/login and /api/auth/register)
export interface AuthResponse {
  id: number;
  acjMail: string;
  token: string | null;
}

// Current user info (decoded from token or stored)
export interface CurrentUser {
  id: number;
  acjMail: string;
  nombre?: string;
  roles?: string[];
}
