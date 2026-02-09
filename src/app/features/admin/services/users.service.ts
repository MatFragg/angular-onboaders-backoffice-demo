import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { UsuarioListResponse, UsuarioUpdateRequest } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/usuarios`;

  /**
   * Get all users
   * GET /api/usuarios
   */
  getUsers(): Observable<UsuarioListResponse[]> {
    return this.http.get<UsuarioListResponse[]>(this.apiUrl);
  }

  /**
   * Get user by ID
   * GET /api/usuarios/{id}
   */
  getUserById(id: number): Observable<UsuarioListResponse> {
    return this.http.get<UsuarioListResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Update user
   * PUT /api/usuarios/{id}
   */
  updateUser(id: number, data: UsuarioUpdateRequest): Observable<UsuarioListResponse> {
    return this.http.put<UsuarioListResponse>(`${this.apiUrl}/${id}`, data);
  }

  /**
   * Toggle user active status (soft delete toggle)
   * PATCH /api/usuarios/{id}/toggle-activo
   */
  toggleUserActive(id: number): Observable<UsuarioListResponse> {
    return this.http.patch<UsuarioListResponse>(`${this.apiUrl}/${id}/toggle-activo`, {});
  }

  /**
   * Delete user (soft delete)
   * DELETE /api/usuarios/{id}
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

