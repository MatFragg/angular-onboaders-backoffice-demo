import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '@env/environment';
import { 
  Cabecera, 
  Detalle,
  OnboarderCompleto,
  CabeceraDetalleResponse,
  PageResponse,
  EstadoCabecera
} from '../models/onboarder.model';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({ providedIn: 'root' })
export class OnboardersService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = environment.apiUrl;

  /**
   * Get paginated list of onboarders (cabeceras)
   * @param page page number (0-indexed for Spring)
   * @param size page size
   * @param estado optional estado filter (PENDIENTE, APROBADO, RECHAZADO)
   * @param empresaId optional company filter
   */
  getCabeceras(page: number = 0, size: number = 20, estado?: EstadoCabecera, empresaId?: number): Observable<PageResponse<Cabecera>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (estado) {
      params = params.set('estado', estado);
    }

    if (empresaId) {
      params = params.set('empresaId', empresaId.toString());
    }

    console.log('[OnboardersService] getCabeceras params:', { page, size, estado });

    return this.http.get<PageResponse<Cabecera>>(`${this.apiUrl}/onboarding`, { params }).pipe(
      tap(response => console.log('[OnboardersService] getCabeceras response:', response))
    );
  }

  /**
   * Get a single cabecera by ID (includes detalle)
   * Returns the flat response from backend which includes detalle
   */
  getCabeceraById(id: number): Observable<CabeceraDetalleResponse> {
    return this.http.get<CabeceraDetalleResponse>(`${this.apiUrl}/onboarding/${id}`).pipe(
      tap(response => console.log('[OnboardersService] getCabeceraById response:', response))
    );
  }

  /**
   * Get complete onboarder info for dialog
   * Adapts the flat API response to the OnboarderCompleto structure used by the view
   */
  getOnboarderCompleto(cabeceraId: number): Observable<OnboarderCompleto | null> {
    return this.getCabeceraById(cabeceraId).pipe(
      map(response => {
        if (response.detalle) {
          // Destructure to separate cabecera fields from detalle
          const { detalle, ...cabecera } = response;
          return {
            cabecera: cabecera as Cabecera,
            detalle: detalle
          };
        }
        // If no embedded detalle, return null
        console.warn('[OnboardersService] No embedded detalle found in response');
        return null;
      })
    );
  }

  /**
   * Approve onboarder
   * PATCH /{id}/aprobar?usuarioId=X
   */
  aprobarOnboarder(id: number): Observable<Cabecera> {
    const usuarioId = this.authService.currentUser()?.id;
    if (!usuarioId) {
      throw new Error('Usuario no autenticado');
    }
    
    const params = new HttpParams().set('usuarioId', usuarioId.toString());
    return this.http.patch<Cabecera>(`${this.apiUrl}/onboarding/${id}/aprobar`, null, { params });
  }

  /**
   * Reject onboarder
   * PATCH /{id}/rechazar?usuarioId=X&motivo=Y
   */
  rechazarOnboarder(id: number, motivo: string): Observable<Cabecera> {
    const usuarioId = this.authService.currentUser()?.id;
    if (!usuarioId) {
      throw new Error('Usuario no autenticado');
    }
    
    const params = new HttpParams()
      .set('usuarioId', usuarioId.toString())
      .set('motivo', motivo);
    return this.http.patch<Cabecera>(`${this.apiUrl}/onboarding/${id}/rechazar`, null, { params });
  }
}
