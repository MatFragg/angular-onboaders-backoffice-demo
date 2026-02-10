import { Component, inject, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UsersService } from '../../services/users.service';
import { UsuarioListResponse, UsuarioUpdateRequest } from '../../models/user.model';

export interface EditUserDialogData {
  user: UsuarioListResponse;
}

@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule
],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>edit</mat-icon>
      Editar Usuario
    </h2>

    <mat-dialog-content>
      <form (ngSubmit)="onSubmit()" class="user-form" id="editUserForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre completo</mat-label>
          <input matInput 
            type="text" 
            [(ngModel)]="nombre" 
            name="nombre"
            required>
          <mat-icon matPrefix>person</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email corporativo</mat-label>
          <input matInput 
            type="email" 
            [(ngModel)]="email" 
            name="email"
            required>
          <mat-icon matPrefix>email</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nueva contraseña (opcional)</mat-label>
          <input matInput 
            [type]="hidePassword ? 'password' : 'text'" 
            [(ngModel)]="password" 
            name="password"
            placeholder="Dejar vacío para mantener la actual">
          <mat-icon matPrefix>lock</mat-icon>
          <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
            <mat-icon>{{ hidePassword ? 'visibility' : 'visibility_off' }}</mat-icon>
          </button>
        </mat-form-field>

        <div class="role-row">
          <mat-form-field appearance="outline">
            <mat-label>Rol</mat-label>
            <mat-select [(ngModel)]="rol" name="rol" required>
              <mat-option value="ADMIN">Administrador</mat-option>
              <mat-option value="USER">Usuario</mat-option>
            </mat-select>
            <mat-icon matPrefix>badge</mat-icon>
          </mat-form-field>

          @if (rol === 'USER') {
            <mat-form-field appearance="outline">
              <mat-label>Sub-rol</mat-label>
              <mat-select [(ngModel)]="subRol" name="subRol" required>
                <mat-option value="OBSERVADOR">Observador</mat-option>
                <mat-option value="RESOLUTOR">Resolutor</mat-option>
              </mat-select>
              <mat-icon matPrefix>work</mat-icon>
            </mat-form-field>
          }
        </div>

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

    <mat-dialog-actions align="end">
      <button mat-stroked-button type="button" (click)="cancel()" [disabled]="isLoading">
        Cancelar
      </button>
      <button mat-flat-button color="primary" type="submit" form="editUserForm" [disabled]="isLoading">
        @if (isLoading) {
          <mat-spinner diameter="20"></mat-spinner>
        } @else {
          <ng-container>
            <mat-icon>save</mat-icon>
            Guardar Cambios
          </ng-container>
        }
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2[mat-dialog-title] {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      padding: 16px 24px;
      background: var(--color-primary-600);
      color: white;
      font-size: 18px;
      font-weight: 500;

      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
    }

    mat-dialog-content {
      padding: 24px !important;
      max-height: 60vh;
    }

    .user-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 500px;
    }

    .full-width {
      width: 100%;
    }

    .role-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      mat-form-field {
        width: 100%;
      }
    }

    /* FIX: Eliminar bordes espurios (Tailwind vs Material) y corregir posición de label */
    
    /* 1. Eliminar bordes laterales internos del outline que aparecen como líneas verticales */
    ::ng-deep .mdc-notched-outline__leading {
      border-right: none !important;
    }
    ::ng-deep .mdc-notched-outline__notch {
      border-left: none !important;
      border-right: none !important;
      border-top: none !important; /* Línea que cruza el label */
    }
    ::ng-deep .mdc-notched-outline__trailing {
      border-left: none !important;
    }

    /* 2. Asegurar que el label tenga fondo blanco para tapar cualquier residuo */
    ::ng-deep .mdc-floating-label {
      background-color: white !important;
      padding: 0 4px !important;
    }
    
    /* 3. Eliminar cualquier borde derecho en el icono prefijo si existiera */
    ::ng-deep .mat-mdc-form-field-icon-prefix {
       border-right: none !important;
       padding-right: 8px; /* Espacio con el texto */
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

    mat-dialog-actions {
      padding: 16px 24px !important;
      border-top: 1px solid var(--color-neutral-300);

      button {
        min-width: 120px;
        height: 42px;
      }

      button[color="primary"] {
        background-color: var(--color-primary-600);
        
        mat-icon {
          margin-right: 8px;
        }
      }

      mat-spinner {
        margin: 0 auto;
      }
    }

    @media (max-width: 600px) {
      .user-form {
        min-width: auto;
      }

      .role-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EditUserDialogComponent implements OnInit {
  private usersService = inject(UsersService);
  private dialogRef = inject(MatDialogRef<EditUserDialogComponent>);
  private data: EditUserDialogData = inject(MAT_DIALOG_DATA);

  // Form fields
  nombre = '';
  email = '';
  password = '';
  rol: 'ADMIN' | 'USER' = 'USER';
  subRol: 'OBSERVADOR' | 'RESOLUTOR' = 'OBSERVADOR';
  
  hidePassword = true;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    // Pre-fill form with existing user data
    const user = this.data.user;
    this.nombre = user.nombre;
    this.email = user.acjMail;
    this.rol = user.rol;
    this.subRol = user.subRol || 'OBSERVADOR';
  }

  onSubmit(): void {
    // Validations
    if (!this.nombre || !this.email) {
      this.errorMessage = 'Por favor completa todos los campos requeridos';
      return;
    }

    // Email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'El formato del email no es válido';
      return;
    }

    if (this.password && this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (this.rol === 'USER' && !this.subRol) {
      this.errorMessage = 'Selecciona un sub-rol';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updateData: UsuarioUpdateRequest = {
      nombre: this.nombre,
      acjMail: this.email,
      rol: this.rol,
      ...(this.password && { password: this.password }),
      ...(this.rol === 'USER' && { subRol: this.subRol })
    };

    this.usersService.updateUser(this.data.user.id, updateData).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Usuario actualizado exitosamente';
        
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error al actualizar usuario';
      }
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
