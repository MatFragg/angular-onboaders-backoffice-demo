import { Component, inject, OnInit } from '@angular/core';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { EmpresasService } from '../../services/empresas.service';

export interface ViewTokenDialogData {
  ruc: string;
  empresaNombre: string;
}

@Component({
  selector: 'app-view-token-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon class="title-icon">vpn_key</mat-icon>
      <span class="title-text">Token de Seguridad</span>
      <button mat-icon-button (click)="close()" class="action-close">
        <mat-icon>close</mat-icon>
      </button>
    </h2>

    <mat-dialog-content>
      <p class="empresa-name">{{ data.empresaNombre }}</p>
      <p class="empresa-ruc">RUC: {{ data.ruc }}</p>

      @if (isLoading) {
        <div class="loading">
          <mat-spinner diameter="32"></mat-spinner>
          <span>Obteniendo token...</span>
        </div>
      } @else if (token) {
        <div class="token-box">
          <code>{{ token }}</code>
          <button mat-icon-button (click)="copyToken()" [matTooltip]="copied ? 'Copiado!' : 'Copiar'" class="copy-btn">
            <mat-icon>{{ copied ? 'check' : 'content_copy' }}</mat-icon>
          </button>
        </div>
      } @else {
        <div class="error-box">
          <mat-icon>error_outline</mat-icon>
          <span>{{ errorMessage }}</span>
        </div>
      }
    </mat-dialog-content>

  `,
  styles: [`
    h2[mat-dialog-title] {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      padding: 16px 8px 16px 24px;
      background-color: var(--color-primary-600);   
      border-bottom: 1px solid var(--color-neutral-200);

      .title-icon {
        color: white;
      }

      .title-text {
        font-size: 18px;
        font-weight: 500;
        flex: 1;
        color: white;
      }

      .action-close {
        color: white;
      }
    }

    mat-dialog-content {
      padding: 24px !important;
      min-width: 420px;
    }

    .empresa-name {
      font-size: 16px;
      font-weight: 500;
      color: var(--color-neutral-900);
      margin: 0 0 4px;
    }

    .empresa-ruc {
      font-size: 13px;
      color: var(--color-neutral-500);
      margin: 0 0 20px;
      font-family: 'Roboto Mono', monospace;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 24px;
      color: var(--color-neutral-600);
      font-size: 14px;
    }

    .token-box {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: var(--color-neutral-100);
      border: 1px solid var(--color-neutral-300);
      border-radius: 8px;

      code {
        flex: 1;
        font-size: 13px;
        word-break: break-all;
        color: var(--color-neutral-800);
        line-height: 1.5;
      }

      .copy-btn {
        flex-shrink: 0;
      }
    }

    .error-box {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: var(--color-error-50);
      border: 1px solid var(--color-error-200);
      border-radius: 8px;
      color: var(--color-error-700);
      font-size: 14px;
    }

    mat-dialog-actions {
      padding: 12px 24px !important;
      border-top: 1px solid var(--color-neutral-200);
    }
  `]
})
export class ViewTokenDialogComponent implements OnInit {
  private empresasService = inject(EmpresasService);
  private dialogRef = inject(MatDialogRef<ViewTokenDialogComponent>);
  data: ViewTokenDialogData = inject(MAT_DIALOG_DATA);

  token = '';
  isLoading = true;
  errorMessage = '';
  copied = false;

  ngOnInit(): void {
    this.empresasService.getToken(this.data.ruc).subscribe({
      next: (res) => {
        this.token = res.token;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error getting token:', err);
        this.errorMessage = err.error?.message || 'No se pudo obtener el token';
        this.isLoading = false;
      },
    });
  }

  copyToken(): void {
    navigator.clipboard.writeText(this.token).then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
