import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OnboarderCompleto, formatLiveness, isLivenessPositive, formatEstado } from '../../../models/onboarder.model';
import { OnboardersService } from '../../../services/onboarders.service';

/**
 * DetailDialogComponent
 * Presentational component for displaying onboarder verification details
 */
@Component({
  selector: 'app-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './detail-dialog.component.html',
  styleUrls: ['./detail-dialog.component.scss']
})
export class DetailDialogComponent {
  private onboardersService = inject(OnboardersService);
  isProcessing = false;

  constructor(
    public dialogRef: MatDialogRef<DetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OnboarderCompleto
  ) {}

  // Getters for easy template access
  get cabecera() { return this.data.cabecera; }
  get detalle() { return this.data.detalle; }
  get isPending() { return this.cabecera.estado === 'PENDIENTE'; }

  close(): void {
    this.dialogRef.close();
  }

  approve(): void {
    this.isProcessing = true;
    this.onboardersService.aprobarOnboarder(this.cabecera.id).subscribe({
      next: () => {
        this.dialogRef.close('aprobado');
      },
      error: (err) => {
        console.error('Error al aprobar:', err);
        this.isProcessing = false;
      }
    });
  }

  reject(): void {
    this.isProcessing = true;
    // TODO: Add modal to input rejection reason
    this.onboardersService.rechazarOnboarder(this.cabecera.id, 'Rechazado por el operador').subscribe({
      next: () => {
        this.dialogRef.close('rechazado');
      },
      error: (err) => {
        console.error('Error al rechazar:', err);
        this.isProcessing = false;
      }
    });
  }

  getScoreClass(score: number | null): string {
    if (score === null) return 'score-warning';
    if (score >= 95) return 'score-success';
    if (score >= 85) return 'score-warning';
    return 'score-error';
  }

  formatLiveness(value: number | null): string {
    return formatLiveness(value);
  }

  isLivenessPositive(value: number | null): boolean {
    return isLivenessPositive(value);
  }

  formatEstado(estado: string): string {
    return formatEstado(estado as any);
  }

  formatFecha(fechaISO: string | null): string {
    if (!fechaISO) return 'N/A';
    const date = new Date(fechaISO);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatFechaHora(fechaISO: string | null): string {
    if (!fechaISO) return 'N/A';
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
