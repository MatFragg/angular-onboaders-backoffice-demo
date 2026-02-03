import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '@env/environment';
import { 
  Cabecera, 
  Detalle,
  OnboarderCompleto,
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
   */
  getCabeceras(page: number = 0, size: number = 20, estado?: EstadoCabecera): Observable<PageResponse<Cabecera>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (estado) {
      params = params.set('estado', estado);
    }

    console.log('[OnboardersService] getCabeceras params:', { page, size, estado });

    return this.http.get<PageResponse<Cabecera>>(`${this.apiUrl}/onboarding`, { params }).pipe(
      tap(response => console.log('[OnboardersService] getCabeceras response:', response))
    );
  }

  /**
   * Get a single cabecera by ID (includes detalle)
   */
  getCabeceraById(id: number): Observable<Cabecera> {
    return this.http.get<Cabecera>(`${this.apiUrl}/onboarding/${id}`).pipe(
      tap(response => console.log('[OnboardersService] getCabeceraById response:', response))
    );
  }

  /**
   * Get complete onboarder info for dialog
   * The cabecera endpoint should return the detalle embedded
   */
  getOnboarderCompleto(cabeceraId: number): Observable<OnboarderCompleto | null> {
    return this.getCabeceraById(cabeceraId).pipe(
      map(cabecera => {
        // Check if cabecera has embedded detalle
        const cabeceraAny = cabecera as any;
        if (cabeceraAny.detalle) {
          return {
            cabecera: cabecera,
            detalle: cabeceraAny.detalle
          };
        }
        // If no embedded detalle, return with null detalle
        console.warn('[OnboardersService] No embedded detalle found in cabecera');
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
