/**
 * User Models for Admin Module
 */

// Response DTO from GET /api/usuarios
export interface UsuarioListResponse {
  id: number;
  nombre: string;
  email: string;
  ruc?: string;
  activo: boolean;
  rol: 'SUPERADMIN' | 'ADMIN' | 'USER';
}

// Request DTO for PUT /api/usuarios/{id}
export interface UsuarioUpdateRequest {
  nombre: string;
  email: string;
  empresaRuc?: string;
  password?: string;  // Optional - only update if provided
  rol: 'SUPERADMIN' | 'ADMIN' | 'USER';
}

