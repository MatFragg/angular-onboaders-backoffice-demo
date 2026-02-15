/**
 * User Models for Admin Module
 */


export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'USER';

// Response DTO from GET /api/usuarios
export interface UsuarioListResponse {
  id: number;
  nombre: string;
  email: string;
  dni?: string;
  empresaRuc?: string | number;
  empresaId?: number;
  empresaNombre?: string;
  activo: boolean;
  rol: UserRole;
}

// Request DTO for PUT /api/usuarios/{id}
export interface UsuarioUpdateRequest {
  nombre: string;
  email: string;
  empresaRuc?: string;
  password?: string;
  rol: UserRole;
}

