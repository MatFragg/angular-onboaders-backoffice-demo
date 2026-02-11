import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { EmpresasService } from '../../services/empresas.service';
import { UsersService } from '../../services/users.service';
import { UsuarioListResponse } from '../../models/user.model';

@Component({
  selector: 'app-create-empresa-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <h2 mat-dialog-title>
      <button mat-icon-button type="button" (click)="cancel()" [disabled]="isLoading" class="action-close">
        <mat-icon>close</mat-icon>
      </button>
      <span class="title-text">Nueva Empresa</span>
      <button mat-icon-button type="submit" form="createEmpresaForm" [disabled]="isLoading" class="action-confirm">
        @if (isLoading) {
          <mat-spinner diameter="20"></mat-spinner>
        } @else {
          <mat-icon>check</mat-icon>
        }
      </button>
    </h2>

    <mat-dialog-content>
      <form (ngSubmit)="onSubmit()" class="empresa-form" id="createEmpresaForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>RUC</mat-label>
          <input matInput
            type="text"
            [(ngModel)]="ruc"
            name="ruc"
            placeholder="20100000000"
            required
            maxlength="11">
          <mat-icon matPrefix>pin</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre de la empresa</mat-label>
          <input matInput
            type="text"
            [(ngModel)]="nombre"
            name="nombre"
            placeholder="ACJ Soluciones S.A.C."
            required>
          <mat-icon matPrefix>business</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email corporativo</mat-label>
          <input matInput
            type="email"
            [(ngModel)]="email"
            name="email"
            placeholder="contacto@empresa.com"
            required>
          <mat-icon matPrefix>email</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Usuario encargado</mat-label>
          <mat-select [(ngModel)]="idUsuarioEncargado" name="idUsuarioEncargado">
            <mat-option [value]="null">Sin asignar</mat-option>
            @for (user of availableUsers; track user.id) {
              <mat-option [value]="user.id">{{ user.nombre }} ({{ user.acjMail }})</mat-option>
            }
          </mat-select>
          <mat-icon matPrefix>person</mat-icon>
        </mat-form-field>

        @if (errorMessage) {
          <div class="message error">
            <mat-icon>error</mat-icon>
            {{ errorMessage }}
          </div>
        }

        @if (successMessage) {
          <div class="message success">
            <mat-icon>check_circle</mat-icon>
            {{ successMessage }}
          </div>
        }
      </form>
    </mat-dialog-content>
  `,
  styles: [`
    h2[mat-dialog-title] {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0;
      padding: 8px 8px 8px 16px;
      background: var(--color-primary-600);
      color: white;

      .title-text {
        font-size: 16px;
        font-weight: 500;
        color: white;
        flex: 1;
        text-align: left;
      }

      .action-close,
      .action-confirm {
        color: rgba(255, 255, 255, 0.7);
      }

      .action-close:hover,
      .action-confirm:hover {
        color: white;
      }

      mat-spinner {
        margin: 0 auto;
      }
    }

    mat-dialog-content {
      padding: 24px !important;
      max-height: 60vh;
    }

    .empresa-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 500px;
    }

    .full-width {
      width: 100%;
    }

    .message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      &.error {
        background: var(--color-error-100);
        color: var(--color-error-700);
      }

      &.success {
        background: var(--color-success-100);
        color: var(--color-success-700);
      }
    }

    @media (max-width: 600px) {
      .empresa-form {
        min-width: auto;
      }
    }
  `]
})
export class CreateEmpresaDialogComponent implements OnInit {
  private empresasService = inject(EmpresasService);
  private usersService = inject(UsersService);
  private dialogRef = inject(MatDialogRef<CreateEmpresaDialogComponent>);

  ruc = '';
  nombre = '';
  email = '';
  idUsuarioEncargado: number | null = null;

  availableUsers: UsuarioListResponse[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.usersService.getUsers().subscribe({
      next: (users) => this.availableUsers = users.filter(u => u.activo),
      error: (err) => console.error('Error loading users:', err),
    });
  }

  onSubmit(): void {
    if (!this.ruc || !this.nombre || !this.email) {
      this.errorMessage = 'Por favor completa todos los campos requeridos';
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Por favor ingresa un email válido';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.empresasService.createEmpresa({
      ruc: this.ruc,
      nombre: this.nombre,
      email: this.email,
      idUsuarioEncargado: this.idUsuarioEncargado,
    }).subscribe({
      next: () => {
        this.successMessage = 'Empresa creada exitosamente';
        setTimeout(() => this.dialogRef.close(true), 1000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al crear la empresa';
        this.isLoading = false;
      },
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
