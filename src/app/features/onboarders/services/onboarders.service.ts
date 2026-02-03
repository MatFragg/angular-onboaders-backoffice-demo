import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map, of, tap } from 'rxjs';
import { environment } from '@env/environment';
import { 
  Cabecera, 
  Detalle,
  OnboarderCompleto,
  PageResponse
} from '../models/onboarder.model';

@Injectable({ providedIn: 'root' })
export class OnboardersService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * Get paginated list of onboarders (cabeceras)
   * @param page page number (0-indexed for Spring)
   * @param size page size
   * @param nroDni optional DNI filter
   */
  getCabeceras(page: number = 0, size: number = 20, nroDni?: string): Observable<PageResponse<Cabecera>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (nroDni) {
      params = params.set('nroDni', nroDni);
    }

    return this.http.get<PageResponse<Cabecera>>(`${this.apiUrl}/onboarding`, { params }).pipe(
      tap(response => console.log('[OnboardersService] getCabeceras response:', response))
    );
  }

  /**
   * Get a single cabecera by ID
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
   */
  aprobarOnboarder(id: number): Observable<Cabecera> {
    return this.http.post<Cabecera>(`${this.apiUrl}/onboarding/${id}/aprobar`, {});
  }

  /**
   * Reject onboarder
   */
  rechazarOnboarder(id: number, motivoRechazo: string): Observable<Cabecera> {
    return this.http.post<Cabecera>(`${this.apiUrl}/onboarding/${id}/rechazar`, { motivoRechazo });
  }
}
