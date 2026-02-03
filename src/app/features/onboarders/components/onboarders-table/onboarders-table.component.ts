import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';

import { Cabecera, formatLiveness, formatEstado } from '../../models/onboarder.model';
import { DniFilterComponent } from '../ui/dni-filter/dni-filter.component';

/**
 * OnboardersTableComponent
 * Presentational component for displaying cabeceras data table
 */
@Component({
  selector: 'app-onboarders-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    DniFilterComponent,
  ],
  templateUrl: './onboarders-table.component.html',
  styleUrls: ['./onboarders-table.component.scss']
})
export class OnboardersTableComponent {
  @Input() dataSource: Cabecera[] = [];
  @Input() totalRecords = 0;
  @Input() isLoading = false;
  @Input() pageSize = 20;
  @Input() pageIndex = 0;

  @Output() filterChange = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<{ pageIndex: number; pageSize: number }>();
  @Output() viewDetail = new EventEmitter<Cabecera>();

  displayedColumns: string[] = [
    'fechaSolicitud',
    'nroDni',
    'nombres',
    'apellidos',
    'validacionDocumento',
    'livenessDetection',
    'comparacionBiometrica',
    'estado',
    'detalle'
  ];

  onFilter(value: string): void {
    this.filterChange.emit(value);
  }

  onPageChange(event: PageEvent): void {
    this.pageChange.emit({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize
    });
  }

  onViewDetail(element: Cabecera): void {
    this.viewDetail.emit(element);
  }

  getEstadoClass(estado: string): string {
    const s = estado.toUpperCase();
    if (s === 'APROBADO') return 'estado-aprobado';
    if (s === 'RECHAZADO') return 'estado-rechazado';
    return 'estado-pendiente';
  }

  formatLiveness(value: number | null): string {
    return formatLiveness(value);
  }

  formatEstado(estado: string): string {
    return formatEstado(estado as any);
  }

  formatFecha(fechaISO: string): string {
    const date = new Date(fechaISO);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
