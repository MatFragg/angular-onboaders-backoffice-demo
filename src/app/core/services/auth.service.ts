import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '@env/environment';
import { LoginRequest, RegisterRequest, AuthResponse, CurrentUser, ForgotPasswordRequest, ResetPasswordRequest, ApiResponse } from '../models/auth.model';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;

  // Reactive state
  currentUser = signal<CurrentUser | null>(this.getStoredUser());
  isAuthenticated = signal(this.hasValidToken());
  userRoles = signal<string[]>(this.getRolesFromToken());

  /**
   * Login with credentials
   * POST /api/auth/login
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.token) {
          this.storeToken(response.token);
        }
        this.storeUser({
          id: response.id,
          email: response.email
        });
        this.currentUser.set({ id: response.id, email: response.email });
        this.isAuthenticated.set(true);
        this.userRoles.set(this.getRolesFromToken());
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Register new user
   * POST /api/auth/register
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(response => {
        console.log('Register successful:', response);
      }),
      catchError(error => {
        console.error('Register error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Request password reset email
   * POST /api/auth/forgot-password
   */
  forgotPassword(email: string): Observable<ApiResponse> {
    const request: ForgotPasswordRequest = { email };
    return this.http.post<ApiResponse>(`${this.apiUrl}/forgot-password`, request).pipe(
      catchError(error => {
        console.error('Forgot password error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Reset password using token
   * POST /api/auth/reset-password
   */
  resetPassword(data: ResetPasswordRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/reset-password`, data).pipe(
      catchError(error => {
        console.error('Reset password error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout - clear token and redirect
   */
  logout(): void {
    this.clearStorage();
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.userRoles.set([]);
    this.router.navigate(['/login']);
  }

  /**
   * Get current auth token
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return this.hasValidToken();
  }

  // ============================================
  // Storage helpers
  // ============================================
  
  private storeToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  private storeUser(user: CurrentUser): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private getStoredUser(): CurrentUser | null {
    const userJson = localStorage.getItem(USER_KEY);
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Basic JWT expiration check
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convert to ms
      return Date.now() < exp;
    } catch {
      return false;
    }
  }

  private clearStorage(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  /**
   * Extract roles from JWT token
   */
  getRolesFromToken(): string[] {
    const payload = this.getTokenPayload();
    return payload?.roles || [];
  }

  /**
   * Get full token payload
   */
  getTokenPayload(): any {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  getUserRuc(): string | undefined {
    const payload = this.getTokenPayload();
    return payload?.ruc || payload?.empresaRuc || undefined;
  }

  getUserName(): string | undefined {
    const payload = this.getTokenPayload();
    // Prioritize explicit name claim, fallback to stored user name
    return payload?.nombre || payload?.name || this.currentUser()?.nombre || undefined;
  }

  /**
   * Check if current user has a specific role
   */
  hasRole(role: string): boolean {
    return this.userRoles().includes(role);
  }

  /**
   * Check if current user is admin
   */
  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }
}
