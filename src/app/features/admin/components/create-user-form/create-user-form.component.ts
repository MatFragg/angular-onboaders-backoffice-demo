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
import { TipoUsuario, SubRol } from '../../../../core/models/auth.model';

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
  confirmPassword = '';
  tipoUsuario: TipoUsuario = 'CORRIENTE';
  subRol: SubRol = 'OBSERVADOR';
  
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

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (this.tipoUsuario === 'CORRIENTE' && !this.subRol) {
      this.errorMessage = 'Selecciona un sub-rol';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const registerData = {
      nombre: this.nombre,
      acjMail: this.email,
      password: this.password,
      activo: true,
      tipoUsuario: this.tipoUsuario,
      ...(this.tipoUsuario === 'CORRIENTE' && { subRol: this.subRol })
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
    this.password = '';
    this.confirmPassword = '';
    this.tipoUsuario = 'CORRIENTE';
    this.subRol = 'OBSERVADOR';
    this.successMessage = '';
    this.errorMessage = '';
  }
}

