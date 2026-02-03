import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

import { EstadoCabecera } from '../../../models/onboarder.model';

/**
 * EstadoFilterComponent
 * Dropdown filter for filtering by estado
 */
@Component({
  selector: 'app-estado-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
  ],
  template: `
    <mat-form-field appearance="outline" class="filter-field">
      <mat-label>Filtrar por Estado</mat-label>
      <mat-select [(ngModel)]="selectedEstado" (selectionChange)="onEstadoChange()">
        <mat-option [value]="null">Todos</mat-option>
        <mat-option value="PENDIENTE">Pendiente</mat-option>
        <mat-option value="APROBADO">Aprobado</mat-option>
        <mat-option value="RECHAZADO">Rechazado</mat-option>
      </mat-select>
      <mat-icon matPrefix>filter_list</mat-icon>
    </mat-form-field>
  `,
  styles: [`
    .filter-field {
      width: 200px;
    }
  `]
})
export class EstadoFilterComponent {
  @Output() filterChange = new EventEmitter<EstadoCabecera | undefined>();

  selectedEstado: EstadoCabecera | null = null;

  onEstadoChange(): void {
    this.filterChange.emit(this.selectedEstado || undefined);
  }
}
