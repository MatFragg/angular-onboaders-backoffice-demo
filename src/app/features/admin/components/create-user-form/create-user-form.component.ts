import { Component, inject, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../../core/services/auth.service';
import { TipoUsuario, RegisterRequest } from '../../../../core/models/auth.model';
import { EmpresasService } from '../../services/empresas.service';
import { EmpresaResponse } from '../../models/empresa.model';
import { RucService } from '../../../../shared/services/ruc.service';

@Component({
  selector: 'app-create-user-dialog',
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
  templateUrl: './create-user-form.component.html',
  styleUrls: ['./create-user-form.component.scss']
})
export class CreateUserDialogComponent implements OnInit {
  private authService = inject(AuthService);
  private empresasService = inject(EmpresasService);
  private rucService = inject(RucService);
  private dialogRef = inject(MatDialogRef<CreateUserDialogComponent>);

  // Form fields
  nombre = '';
  email = '';
  password = '';
  ruc = '';
  empresaRuc: string | number = '';
  confirmPassword = '';
  tipoUsuario: TipoUsuario = 'USER';
  
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;
  isRucLoading = false;
  errorMessage = '';
  successMessage = '';
  
  availableEmpresas: EmpresaResponse[] = [];
  isEmpresaLocked = false;
  isRoleLocked = false;
  availableRoles: { value: TipoUsuario, label: string }[] = [];

  ngOnInit(): void {
    const isSuperAdmin = this.authService.hasRole('SUPERADMIN');
    const isAdmin = this.authService.hasRole('ADMIN');

    // Role configuration
    if (isSuperAdmin) {
      // SuperAdmin can create Admin and User (removed SuperAdmin creation for now)
      this.availableRoles = [
        { value: 'ADMIN', label: 'Administrador' },
        { value: 'USER', label: 'Usuario' }
      ];
      this.isRoleLocked = false;
    } else if (isAdmin) {
      // Admin can only create User
      this.availableRoles = [
        { value: 'USER', label: 'Usuario' }
      ];
      this.tipoUsuario = 'USER';
      this.isRoleLocked = true;

      // Pre-fill and lock company for Admin users
      const ruc = this.authService.getUserRuc();
      if (ruc) {
        // Ensure RUC matches the type in the dropdown (number vs string)
        // If the dropdown options use numbers (from backend Long), we need to match it.
        // Assuming backend sends numbers in JSON regardless of TS interface saying string.
        this.empresaRuc = ruc; 
        
        // If ruc is a string but options are numbers, or vice-versa, we might need conversion.
        // But since we don't know for sure if backend returns number in JSON (it does if it's Long),
        // let's try to handle potential type mismatch by checking later or casting.
        // Actually, let's just use loose equality or handle it in the template.
        // But better: Parse it as number if it looks like one.
        // However, getUserRuc returns string.
        // Let's try to convert to number if we can, or just leave it if it works as string.
        
        // BETTER APPROACH: Match whatever is in availableEmpresas once loaded.
        this.isEmpresaLocked = true;
      }
    } else {
       // Fallback for just USER role (should not happen in this dialog usually)
       this.availableRoles = [{ value: 'USER', label: 'Usuario' }];
       this.tipoUsuario = 'USER';
       this.isRoleLocked = true; 
    }

    // Load companies for dropdown
    this.empresasService.getEmpresas('', 0, 100).subscribe({
      next: (page) => {
        this.availableEmpresas = page.content;

        // Ensure selection matches type
        if (this.isEmpresaLocked && this.empresaRuc) {
          const found = this.availableEmpresas.find(e => String(e.ruc) === String(this.empresaRuc));
          if (found) {
            this.empresaRuc = found.ruc;
          }
        }
      },
      error: (err) => console.error('Error loading companies:', err)
    });
  }

  onRucChange(): void {
    if (this.ruc && this.ruc.length === 11) {
      this.isRucLoading = true;
      this.rucService.consultarRuc(this.ruc).subscribe((nombre) => {
        this.isRucLoading = false;
        if (nombre) {
          this.nombre = nombre;
        }
      });
    }
  }

  onSubmit(): void {
    // Validations
    if (!this.nombre || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    // Email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'El formato del email no es válido';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    if (this.ruc.length !== 11) {
      this.errorMessage = 'El RUC debe tener 11 caracteres';
      return;
    }

    if (this.empresaRuc && String(this.empresaRuc).length !== 11) {
      this.errorMessage = 'El RUC de empresa debe tener 11 caracteres';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    // if (this.tipoUsuario === 'USER') {
    //   // No subRol validation needed anymore
    // }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const registerData: RegisterRequest = {
      nombre: this.nombre,
      email: this.email,
      ruc: this.ruc,
      // @ts-ignore
      ...(this.empresaRuc && { empresaRuc: this.empresaRuc }),
      password: this.password,
      activo: true,
      tipoUsuario: this.tipoUsuario
    };

    this.authService.register(registerData).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = `Usuario "${this.nombre}" creado exitosamente`;
        
        // Close dialog after success with result
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error al crear usuario';
      }
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  resetForm(): void {
    this.nombre = '';
    this.email = '';
    this.empresaRuc = '';
    this.password = '';
    this.confirmPassword = '';
    this.tipoUsuario = 'USER';
    this.successMessage = '';
    this.errorMessage = '';
  }
}

