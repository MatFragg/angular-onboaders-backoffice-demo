import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { OnboardersService } from '../../services/onboarders.service';
import { Cabecera, PageResponse } from '../../models/onboarder.model';
import { OnboardersTableComponent } from '../../components/onboarders-table/onboarders-table.component';
import { DetailDialogComponent } from '../../components/ui/detail-dialog/detail-dialog.component';

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
    MatDialogModule,
    OnboardersTableComponent,
  ],
  templateUrl: './onboarders.page.html',
  styleUrls: ['./onboarders.page.scss']
})
export class OnboardersPage implements OnInit {
  private onboardersService = inject(OnboardersService);
  private dialog = inject(MatDialog);

  // State
  cabeceras = signal<Cabecera[]>([]);
  totalElements = signal(0);
  isLoading = signal(false);
  
  // Pagination
  pageNumber = 0;
  pageSize = 20;
  
  // Filter
  filterValue = '';

  ngOnInit(): void {
    this.loadCabeceras();
  }

  loadCabeceras(): void {
    this.isLoading.set(true);
    
    this.onboardersService.getCabeceras(
      this.pageNumber, 
      this.pageSize,
      this.filterValue || undefined
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

  onFilter(value: string): void {
    this.filterValue = value;
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
