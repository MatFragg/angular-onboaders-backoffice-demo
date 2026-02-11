/**
 * Empresa Models for Admin Module
 */

// Response DTO from GET /api/empresas
export interface EmpresaResponse {
  ruc: string;
  nombre: string;
  email: string;
  idUsuarioEncargado: number | null;
  nombreUsuarioEncargado: string | null;
}

// Request DTO for POST/PUT /api/empresas
export interface EmpresaRequest {
  ruc: string;
  nombre: string;
  email: string;
  idUsuarioEncargado: number | null;
}

// Spring Boot Page response wrapper
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page (0-based)
  first: boolean;
  last: boolean;
}
