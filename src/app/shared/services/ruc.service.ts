import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '@env/environment';

export interface RucResponse {
  success: boolean;
  ruc: string;
  nombre_o_razon_social: string;
  estado_del_contribuyente: string;
  condicion_de_domicilio: string;
  ubigeo: string;
  tipo_de_via: string;
  nombre_de_via: string;
  codigo_de_zona: string;
  tipo_de_zona: string;
  numero: string;
  interior: string;
  lote: string;
  dpto: string;
  manzana: string;
  kilometro: string;
  departamento: string;
  provincia: string;
  distrito: string;
  direccion: string;
  direccion_completa: string;
  ultima_actualizacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class RucService {
  private http = inject(HttpClient);
  // private apiUrl = 'https://ruc.com.pe/api/v1/consultas';
  // Use backend API
  private apiUrl = `${environment.apiUrl}/v1/consultas`;

  consultarRuc(ruc: string): Observable<string | null> {
    return this.http.get<RucResponse>(`${this.apiUrl}/${ruc}`).pipe(
      map(response => {
        if (response && response.success) {
          return response.nombre_o_razon_social;
        }
        return null;
      }),
      catchError(error => {
        console.error('Error fetching RUC data from backend:', error);
        return of(null);
      })
    );
  }
}
