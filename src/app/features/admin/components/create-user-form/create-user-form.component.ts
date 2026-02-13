import { Component, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../../core/services/auth.service';
import { TipoUsuario } from '../../../../core/models/auth.model';

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
export class CreateUserDialogComponent {
  private authService = inject(AuthService);
  private dialogRef = inject(MatDialogRef<CreateUserDialogComponent>);

  // Form fields
  nombre = '';
  email = '';
  password = '';
  dni='';
  empresaRuc='';
  confirmPassword = '';
  tipoUsuario: TipoUsuario = 'USER';
  
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

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

    if (this.dni.length !== 8) {
      this.errorMessage = 'El DNI debe tener 8 caracteres';
      return;
    }

    if (this.empresaRuc && this.empresaRuc.length !== 11) {
      this.errorMessage = 'El RUC debe tener 11 caracteres';
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

    const registerData = {
      nombre: this.nombre,
      email: this.email,
      dni: this.dni,
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

