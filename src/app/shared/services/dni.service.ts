import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

export interface DniResponse {
  success: boolean;
  data: {
    numero: string;
    nombre_completo: string;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    codigo_verificacion: string;
  };
}

export interface DniResponseOnboarder {
  numero: string;
  nombre_completo: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  codigo_verificacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class DniService {
  private http = inject(HttpClient);
  private apiUrl = 'https://apiperu.dev/api/dni';
  // TODO: Replace with actual token or move to environment
  private token = 'fc84b380ce60ce6b95f8a128d43b552d7b9260c8d7d45b41e36cdb843afb85c8'; 

  consultarDni(dni: string): Observable<string | null> {
    const headers = new HttpHeaders({
      'Accept': 'application/json', 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });

    const body = { dni };

    return this.http.post<DniResponse>(this.apiUrl, body, { headers }).pipe(
      map(response => {
        if (response && response.success) {
          return response.data.nombre_completo;
        }
        return null;
      }),
      catchError(error => {
        console.error('Error fetching DNI data:', error);
        return of(null);
      })
    );
  }

  consultarDniOnboarderBackend(dni: string): Observable<string | null> {
    // using direct URL as user provided
    return this.http.get<DniResponseOnboarder>(`http://localhost:8081/api/v1/consultas/dni/${dni}`).pipe(
      map(response => {
        if (response && response.nombre_completo) {
          return response.nombre_completo;
        }
        return null;
      }),
      catchError(error => {
        console.error('Error fetching DNI data:', error);
        return of(null);
      })
    );
  }
}
