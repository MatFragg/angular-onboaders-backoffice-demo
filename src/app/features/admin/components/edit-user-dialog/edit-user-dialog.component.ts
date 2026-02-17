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
import { UsuarioListResponse, UsuarioUpdateRequest, UserRole } from '../../models/user.model';
import { EmpresasService } from '../../services/empresas.service';
import { EmpresaResponse } from '../../models/empresa.model';
import { AuthService } from '../../../../core/services/auth.service';
import { RucService } from '../../../../shared/services/ruc.service';
import { DniService } from '../../../../shared/services/dni.service';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatProgressSpinnerModule,
    MatTooltipModule
],
  template: `
    <h2 mat-dialog-title>
      <button mat-icon-button type="button" (click)="cancel()" [disabled]="isLoading" class="action-close">
        <mat-icon>close</mat-icon>
      </button>
      <span class="title-text">Editar Usuario</span>
      <button mat-icon-button type="submit" form="editUserForm" [disabled]="isLoading" class="action-confirm">
        @if (isLoading) {
          <mat-spinner diameter="20"></mat-spinner>
        } @else {
          <mat-icon>check</mat-icon>
        }
      </button>
    </h2>

    <mat-dialog-content>
      <form (ngSubmit)="onSubmit()" class="user-form" id="editUserForm">
        
        <div class="role-row">
          <mat-form-field appearance="outline">
            <mat-label>DNI</mat-label>
            <input matInput 
              type="text" 
              [(ngModel)]="dni" 
              name="dni"
              placeholder="DNI (8)"
              maxlength="8"
              required>
            <mat-icon matPrefix>badge</mat-icon>
            @if (isDocumentoLoading) {
                <mat-spinner matSuffix diameter="18"></mat-spinner>
            } @else {
                <button mat-icon-button matSuffix (click)="searchDocumento()" type="button" matTooltip="Buscar Documento">
                  <mat-icon>search</mat-icon>
                </button>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Empresa (RUC)</mat-label>
            <input matInput 
               type="text" 
               [(ngModel)]="empresaRuc" 
               name="empresaRuc" 
               [disabled]="isEmpresaLocked"
               placeholder="12345678901"
               maxlength="11">
            <mat-icon matPrefix>business</mat-icon>
            @if (isEmpresaLoading) {
                <mat-spinner matSuffix diameter="18"></mat-spinner>
            } @else {
                <button mat-icon-button matSuffix (click)="searchEmpresa()" type="button" [disabled]="isEmpresaLocked" matTooltip="Buscar Empresa">
                  <mat-icon>search</mat-icon>
                </button>
            }
          </mat-form-field>
        </div>

        <div class="role-row">
          <mat-form-field appearance="outline">
            <mat-label>Nombre completo</mat-label>
            <input matInput 
              type="text" 
              [(ngModel)]="nombre" 
              name="nombre"
              required>
            <mat-icon matPrefix>person</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
             <mat-label>Razón Social Empresa</mat-label>
             <input matInput [value]="empresaNombre" readonly>
             <mat-icon matPrefix>domain</mat-icon>
          </mat-form-field>
        </div>

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
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Rol</mat-label>
            <mat-select [(ngModel)]="rol" name="rol" required [disabled]="isRoleLocked">
              @for (roleItem of availableRoles; track roleItem.value) {
                <mat-option [value]="roleItem.value">{{ roleItem.label }}</mat-option>
              }
            </mat-select>
            <mat-icon matPrefix>badge</mat-icon>
          </mat-form-field>
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
  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  private empresasService = inject(EmpresasService);
  private rucService = inject(RucService);
  private dniService = inject(DniService);
  private dialogRef = inject(MatDialogRef<EditUserDialogComponent>);
  public data: EditUserDialogData = inject(MAT_DIALOG_DATA);

  // Form fields
  nombre = '';
  email = '';
  dni = '';
  ruc = '';
  empresaRuc: string | number = '';
  password = '';
  rol: any = 'USER';
  
  hidePassword = true;
  isLoading = false;
  isDocumentoLoading = false;
  errorMessage = '';
  successMessage = '';
  
  // Company Search
  empresaNombre = '';
  isEmpresaLoading = false;
  
  // Permission flags
  isEmpresaLocked = false;
  isRoleLocked = false;
  availableRoles: any[] = [];

  ngOnInit(): void {
    const isSuperAdmin = this.authService.hasRole('SUPERADMIN');
    const isAdmin = this.authService.hasRole('ADMIN');

    // Role configuration
    if (isSuperAdmin) {
      this.availableRoles = [
        { value: 'SUPERADMIN', label: 'Super Admin' },
        { value: 'ADMIN', label: 'Administrador' },
        { value: 'USER', label: 'Usuario' }
      ];
      this.isRoleLocked = false;
    } else if (isAdmin) {
      // Admin can only create User
      this.availableRoles = [
        { value: 'USER', label: 'Usuario' }
      ];
      this.isRoleLocked = true;

      // Pre-fill and lock company for Admin users
      const ruc = this.authService.getUserRuc();
      if (ruc) {
        this.empresaRuc = ruc;
        this.isEmpresaLocked = true;
      }
    } else {
       this.availableRoles = [{ value: 'USER', label: 'Usuario' }];
       this.isRoleLocked = true;
    }

    // We no longer load all companies. 
    // If locked (Admin), we might want to ensure name is loaded if not already.
    if (this.isEmpresaLocked && this.empresaRuc && !this.empresaNombre) {
       this.searchEmpresa();
    }

    // Pre-fill form with existing user data
    const user = this.data.user;
    this.nombre = user.nombre;
    this.email = user.email;
    this.dni = user.dni || (user.ruc && user.ruc.length === 8 ? user.ruc : '');
    this.ruc = (user.ruc && user.ruc.length === 11) ? user.ruc : '';
    // If personal RUC was 11 digits, we might generally ignore it now for edit, or map it to ruc?
    // User context seems to favor DNI.
    if (!this.isEmpresaLocked) {
        this.empresaRuc = user.empresaId ? String(user.empresaRuc || '') : '';
        this.empresaNombre = user.empresaNombre || '';
    }
    this.rol = user.rol;
  }



  searchDocumento(): void {
    if (this.dni && this.dni.length === 8) {
        this.isDocumentoLoading = true;
        this.dniService.consultarDni(this.dni).subscribe({
          next: (nombre) => {
            this.isDocumentoLoading = false;
            if (nombre) {
              this.nombre = nombre;
            }
          },
          error: (err) => {
             this.isDocumentoLoading = false;
             console.error('Error fetching DNI:', err);
          }
        });
    } else {
        // Optional: show error for invalid length
    }
  }

  searchEmpresa(): void {
    if (this.empresaRuc && String(this.empresaRuc).length === 11) {
      this.isEmpresaLoading = true;
      this.rucService.consultarRuc(String(this.empresaRuc)).subscribe({
        next: (nombre) => {
          this.isEmpresaLoading = false;
          if (nombre) {
            this.empresaNombre = nombre;
          } else {
             this.empresaNombre = '';
             // Optional: show local error or just clear name
          }
        },
        error: (err) => {
          this.isEmpresaLoading = false;
          console.error('Error fetching Company RUC:', err);
        }
      });
    }
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

    if (this.dni && this.dni.length !== 8) {
       this.errorMessage = 'El DNI debe tener 8 dígitos';
       return;
    }

    if (this.empresaRuc && String(this.empresaRuc).length !== 11) {
      this.errorMessage = 'El RUC de la empresa debe tener 11 caracteres';
      return;
    }

    if (this.password && this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    // if (this.rol === 'USER') {
    //   // No subRol validation needed
    // }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updateData: UsuarioUpdateRequest = {
      nombre: this.nombre,
      email: this.email,
      dni: this.dni,
      ruc: this.ruc,
      ...(this.empresaRuc && { empresaRuc: String(this.empresaRuc) }),
      rol: this.rol,
      ...(this.password && { password: this.password })
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
