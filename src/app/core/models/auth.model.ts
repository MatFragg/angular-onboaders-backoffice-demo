/**
 * Authentication Models
 */

// Login request DTO
export interface LoginRequest {
  acjMail: string;
  password: string;
}

// Auth response DTO (from /api/auth/login)
export interface AuthResponse {
  id: number;
  acjMail: string;
  token: string;
}

// Current user info (decoded from token or stored)
export interface CurrentUser {
  id: number;
  acjMail: string;
  roles?: string[];
}
