/**
 * User Models for Admin Module
 */

// Response DTO from GET /api/usuarios
export interface UsuarioListResponse {
  id: number;
  nombre: string;
  acjMail: string;
  activo: boolean;
  rol: 'ADMIN' | 'USER';  // ADMIN or USER
  subRol?: 'OBSERVADOR' | 'RESOLUTOR' | null;  // Only for USER (UsuarioCorriente)
}

// Request DTO for PUT /api/usuarios/{id}
export interface UsuarioUpdateRequest {
  nombre: string;
  acjMail: string;
  password?: string;  // Optional - only update if provided
  rol: 'ADMIN' | 'USER';
  subRol?: 'OBSERVADOR' | 'RESOLUTOR' | null;
}

