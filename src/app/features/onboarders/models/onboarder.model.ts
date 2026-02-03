/**
 * Onboarder Models
 * TypeScript interfaces matching the Spring Boot API structure
 */

// Cabecera (Header) - data from /api/onboarding
export interface Cabecera {
  id: number;
  nombres: string;
  apellidos: string;
  nroDni: string;
  fechaSolicitud: string;
  validacionDocumento: number | null;
  comparacionBiometrica: number | null;
  livenessDetection: number | null;
  estado: EstadoOnboarder;
  estadoProceso: EstadoProceso;
  pasoActual: number;
  pasoFallido: string | null;
  mensajeError: string | null;
  fechaCompletado: string | null;
  fechaAprobacion: string | null;
  fechaRechazo: string | null;
  motivoRechazo: string | null;
  tratante: Tratante | null;
}

// Tratante (person who processed)
export interface Tratante {
  id: number;
  nombre: string;
  acjMail: string;
}

// Detalle - additional info for dialog
export interface Detalle {
  id: number;
  nacionalidad: string | null;
  sexo: 'F' | 'M' | null;
  fechaNacimiento: string | null;
  fechaEmision: string | null;
  fechaCaducidad: string | null;
  fotoAnverso: string | null;
  fotoReverso: string | null;
  fotoFacialDni: string | null;
  fotoSelfie: string | null;
  firma: string | null;
  estado: EstadoOnboarder;
}

// Estado enum
export type EstadoOnboarder = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';

// Estado de proceso
export type EstadoProceso = 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

// Combined view for dialog (cabecera + detalle)
export interface OnboarderCompleto {
  cabecera: Cabecera;
  detalle: Detalle;
}

// Spring Boot paginated response
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  numberOfElements: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
  };
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
}

// Filter params
export interface OnboarderFilters {
  nroDni?: string;
  estado?: EstadoOnboarder;
}

// Helper to check if liveness is positive (>= 90%)
export function isLivenessPositive(livenessDetection: number | null): boolean {
  if (livenessDetection === null) return false;
  return livenessDetection >= 90;
}

// Helper to format liveness for display
export function formatLiveness(livenessDetection: number | null): string {
  if (livenessDetection === null) return 'N/A';
  return isLivenessPositive(livenessDetection) ? 'Positivo' : 'Negativo';
}

// Helper to format estado for display
export function formatEstado(estado: EstadoOnboarder): string {
  switch (estado) {
    case 'APROBADO': return 'Aprobado';
    case 'RECHAZADO': return 'Rechazado';
    case 'PENDIENTE': return 'Pendiente';
    default: return estado;
  }
}
