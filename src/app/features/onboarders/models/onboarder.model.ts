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
  
  // Reniec fields
  reniecHit?: boolean | null;
  reniecSimilarity?: number | null;
  fechaValidacionReniec?: string | null;
  metadataReniec?: string | null;

  // Metadata
  metadataOCR?: string | null;
  metadataLiveness?: string | null;
  metadataComparacion?: string | null;
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
  // fechaEmision removed as it is not in backend
  fechaCaducidad: string | null;
  fotoAnverso: string | null;
  fotoReverso: string | null;
  fotoFacialDni: string | null;
  fotoSelfie: string | null;
  // firma removed as it is not in backend
  estado: EstadoOnboarder;
}

// Flat response from API
export interface CabeceraDetalleResponse extends Cabecera {
  detalle: Detalle;
}

// Estado enum (used as filter param)
export type EstadoOnboarder = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
export type EstadoCabecera = EstadoOnboarder; // Alias for backend compatibility

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

// Score threshold for positive validation (>= 90%)
const SCORE_THRESHOLD = 90;

/**
 * Normalizes a score to percentage (0-100 range)
 * If value is <= 1, assumes it's a decimal (0.93) and converts to percentage (93)
 * Otherwise returns as-is
 */
export function normalizeScore(score: number | null): number | null {
  if (score === null) return null;
  // If score is between 0 and 1 (inclusive), convert to percentage
  if (score > 0 && score <= 1) {
    return Math.round(score * 100);
  }
  return score;
}

// Helper to check if liveness is positive (>= 90%)
export function isLivenessPositive(livenessDetection: number | null): boolean {
  const normalized = normalizeScore(livenessDetection);
  if (normalized === null) return false;
  return normalized >= SCORE_THRESHOLD;
}

// Helper to format liveness for display
export function formatLiveness(livenessDetection: number | null): string {
  if (livenessDetection === null) return 'N/A';
  return isLivenessPositive(livenessDetection) ? 'Positivo' : 'Negativo';
}

// Helper to check if document validation is positive (>= 90%)
export function isDocumentoPositive(validacionDocumento: number | null): boolean {
  const normalized = normalizeScore(validacionDocumento);
  if (normalized === null) return false;
  return normalized >= SCORE_THRESHOLD;
}

// Helper to format document validation for display
export function formatDocumento(validacionDocumento: number | null): string {
  if (validacionDocumento === null) return 'N/A';
  return isDocumentoPositive(validacionDocumento) ? 'Válido' : 'Inválido';
}

// Helper to check if biometric comparison is positive (>= 90%)
export function isComparacionPositive(comparacionBiometrica: number | null): boolean {
  const normalized = normalizeScore(comparacionBiometrica);
  if (normalized === null) return false;
  return normalized >= SCORE_THRESHOLD;
}

// Helper to format biometric comparison for display
export function formatComparacion(comparacionBiometrica: number | null): string {
  if (comparacionBiometrica === null) return 'N/A';
  return isComparacionPositive(comparacionBiometrica) ? 'Coincide' : 'No coincide';
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


