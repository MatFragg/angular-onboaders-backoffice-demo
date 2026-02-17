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
import { DniService } from '../../../../shared/services/dni.service';

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
  private dniService = inject(DniService);
  private dialogRef = inject(MatDialogRef<CreateUserDialogComponent>);

  // Form fields
  nombre = '';
  email = '';
  password = '';
  dni = '';
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
  
  isEmpresaLocked = false;
  isRoleLocked = false;
  availableRoles: { value: TipoUsuario, label: string }[] = [];
  
  // Company search
  empresaNombre = '';
  isEmpresaLoading = false;

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

    if (this.isEmpresaLocked && this.empresaRuc) {
       this.loadLockedEmpresaName();
    }
  }

  // Removed getEmpresas call since we now search by RUC manually for company
  // Note: If isEmpresaLocked is true (Admin), we might want to fetch the name.
  // But Admin already has their company ID/RUC. We can fetch name if needed, 
  // or just rely on them knowing it. For 'create user', they are creating for their company.
  // Ideally we should fetch the name if locked.
  loadLockedEmpresaName(): void {
     if (this.isEmpresaLocked && this.empresaRuc) {
        this.isEmpresaLoading = true;
        this.rucService.consultarRuc(String(this.empresaRuc)).subscribe(nombre => {
           this.isEmpresaLoading = false;
           if (nombre) this.empresaNombre = nombre;
        });
     }
  }

  searchDocumento(): void {
    if (this.dni) {
      if (this.dni.length === 8) {
        this.isRucLoading = true;
        this.dniService.consultarDniOnboarderBackend(this.dni).subscribe({
          next: (nombre) => {
            this.isRucLoading = false;
            if (nombre) {
              this.nombre = nombre;
            }
          },
          error: (err) => {
             this.isRucLoading = false;
             console.error('Error fetching DNI:', err);
          }
        });
      } else {
        this.isRucLoading = false;
        this.errorMessage = 'El DNI debe tener 8 dígitos.';
      }
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
             // Optional: Show simplified error or just clear name
             this.empresaNombre = '';
             this.errorMessage = 'No se encontró la empresa.';
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

    if(this.dni && this.dni.length !== 8){
      this.errorMessage = 'El DNI debe tener 8 dígitos';
      return;
    }
    
    if (this.ruc && this.ruc.length !== 11) {
      this.errorMessage = 'El RUC debe tener 11 dígitos';
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
      dni: this.dni,
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
        // Check if error message is an object and try to extract string
        if (typeof this.errorMessage === 'object') {
           this.errorMessage = JSON.stringify(this.errorMessage);
        }
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
    this.empresaNombre = '';
    this.password = '';
    this.confirmPassword = '';
    this.tipoUsuario = 'USER';
    this.dni = ''; 
    this.ruc = '';
    this.successMessage = '';
    this.errorMessage = '';
  }
}

