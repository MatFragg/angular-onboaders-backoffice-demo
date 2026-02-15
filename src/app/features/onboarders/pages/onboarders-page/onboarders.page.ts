import { Component, inject, signal, OnInit } from '@angular/core';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

import { OnboardersService } from '../../services/onboarders.service';
import { Cabecera, EstadoCabecera, PageResponse } from '../../models/onboarder.model';
import { OnboardersTableComponent } from '../../components/onboarders-table/onboarders-table.component';
import { DetailDialogComponent } from '../../components/ui/detail-dialog/detail-dialog.component';
import { AuthService } from '../../../../core/services/auth.service';
import { EmpresasService } from '../../../admin/services/empresas.service';
import { EmpresaResponse } from '../../../admin/models/empresa.model';

/**
 * OnboardersPage
 * Page component that orchestrates the onboarders view
 * This is a "smart" page that handles data fetching and dialog coordination
 */
@Component({
  selector: 'app-onboarders-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    OnboardersTableComponent
],
  templateUrl: './onboarders.page.html',
  styleUrls: ['./onboarders.page.scss']
})
export class OnboardersPage implements OnInit {
  private onboardersService = inject(OnboardersService);
  private authService = inject(AuthService);
  private empresasService = inject(EmpresasService);
  private dialog = inject(MatDialog);

  // State
  cabeceras = signal<Cabecera[]>([]);
  totalElements = signal(0);
  isLoading = signal(false);
  
  // Pagination
  pageNumber = 0;
  pageSize = 20;
  
  // Filter
  filterEstado: EstadoCabecera | undefined = undefined;
  filterEmpresaId: number | undefined = undefined;
  
  // SuperAdmin specialized
  isSuperAdmin = false;
  empresas: EmpresaResponse[] = [];

  ngOnInit(): void {
    this.isSuperAdmin = this.authService.hasRole('SUPERADMIN');
    
    if (this.isSuperAdmin) {
      this.loadEmpresas();
    }
    
    this.loadCabeceras();
  }
  
  loadEmpresas(): void {
    this.empresasService.getEmpresas('', 0, 100).subscribe({
      next: (page: any) => this.empresas = page.content,
      error: (err: any) => console.error('Error loading companies for filter', err)
    });
  }

  loadCabeceras(): void {
    this.isLoading.set(true);
    
    this.onboardersService.getCabeceras(
      this.pageNumber, 
      this.pageSize,
      this.filterEstado,
      this.filterEmpresaId
    ).subscribe({
      next: (response: PageResponse<Cabecera>) => {
        this.cabeceras.set(response.content);
        this.totalElements.set(response.totalElements);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading cabeceras:', err);
        this.isLoading.set(false);
      }
    });
  }
  
  onEmpresaFilterChange(empresaId: number | undefined): void {
      this.filterEmpresaId = empresaId;
      this.pageNumber = 0;
      this.loadCabeceras();
  }

  onFilter(value: EstadoCabecera | undefined): void {
    this.filterEstado = value;
    this.pageNumber = 0; // Reset to first page
    this.loadCabeceras();
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCabeceras();
  }

  onViewDetail(cabecera: Cabecera): void {
    this.onboardersService.getOnboarderCompleto(cabecera.id).subscribe({
      next: (onboarderCompleto) => {
        if (!onboarderCompleto) {
          console.error('No se encontró detalle para esta cabecera');
          return;
        }
        
        const dialogRef = this.dialog.open(DetailDialogComponent, {
          data: onboarderCompleto,
          width: '900px',
          maxWidth: '95vw',
          panelClass: 'detail-dialog-panel',
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === 'aprobado' || result === 'rechazado') {
            this.loadCabeceras();
          }
        });
      },
      error: (err) => {
        console.error('Error loading detalle:', err);
      }
    });
  }
}
