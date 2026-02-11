import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { EmpresaResponse, EmpresaRequest, PageResponse } from '../models/empresa.model';

@Injectable({ providedIn: 'root' })
export class EmpresasService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/empresas`;

  /**
   * List empresas (paginated, with optional filter)
   * GET /api/empresas?filtro=&page=&size=
   */
  getEmpresas(filtro?: string, page = 0, size = 10): Observable<PageResponse<EmpresaResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filtro) {
      params = params.set('filtro', filtro);
    }

    return this.http.get<PageResponse<EmpresaResponse>>(this.apiUrl, { params });
  }

  /**
   * Get empresa by RUC
   * GET /api/empresas/{ruc}
   */
  getEmpresa(ruc: string): Observable<EmpresaResponse> {
    return this.http.get<EmpresaResponse>(`${this.apiUrl}/${ruc}`);
  }

  /**
   * Create empresa
   * POST /api/empresas
   */
  createEmpresa(data: EmpresaRequest): Observable<EmpresaResponse> {
    return this.http.post<EmpresaResponse>(this.apiUrl, data);
  }

  /**
   * Update empresa
   * PUT /api/empresas/{ruc}
   */
  updateEmpresa(ruc: string, data: EmpresaRequest): Observable<EmpresaResponse> {
    return this.http.put<EmpresaResponse>(`${this.apiUrl}/${ruc}`, data);
  }

  /**
   * Delete empresa
   * DELETE /api/empresas/{ruc}
   */
  deleteEmpresa(ruc: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${ruc}`);
  }

  /**
   * Get security token for empresa
   * GET /api/empresas/{ruc}/token
   */
  getToken(ruc: string): Observable<{ token: string }> {
    return this.http.get<{ token: string }>(`${this.apiUrl}/${ruc}/token`);
  }
}
