import { Component, inject } from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../../core/services/auth.service';
import { TipoUsuario } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule
],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>ACJ Onboarder</mat-card-title>
          <mat-card-subtitle>Crear nueva cuenta</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nombre completo</mat-label>
              <input matInput 
                type="text" 
                [(ngModel)]="nombre" 
                name="nombre"
                placeholder="Juan Pérez"
                required>
              <mat-icon matPrefix>person</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email corporativo</mat-label>
              <input matInput 
                type="email" 
                [(ngModel)]="email" 
                name="email"
                placeholder="usuario@acj.com"
                required>
              <mat-icon matPrefix>email</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contraseña</mat-label>
              <input matInput 
                [type]="hidePassword ? 'password' : 'text'" 
                [(ngModel)]="password" 
                name="password"
                required
                minlength="6">
              <mat-icon matPrefix>lock</mat-icon>
              <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirmar contraseña</mat-label>
              <input matInput 
                [type]="hideConfirmPassword ? 'password' : 'text'" 
                [(ngModel)]="confirmPassword" 
                name="confirmPassword"
                required>
              <mat-icon matPrefix>lock_outline</mat-icon>
              <button mat-icon-button matSuffix type="button" (click)="hideConfirmPassword = !hideConfirmPassword">
                <mat-icon>{{ hideConfirmPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Tipo de usuario</mat-label>
              <mat-select [(ngModel)]="tipoUsuario" name="tipoUsuario" required>
                <mat-option value="SUPERADMIN">Super Admin</mat-option>
                <mat-option value="ADMIN">Administrador</mat-option>
                <mat-option value="USER">Usuario</mat-option>
              </mat-select>
              <mat-icon matPrefix>badge</mat-icon>
            </mat-form-field>

            @if (errorMessage) {
              <div class="error-message">
                <mat-icon>error</mat-icon>
                {{ errorMessage }}
              </div>
            }

            @if (successMessage) {
              <div class="success-message">
                <mat-icon>check_circle</mat-icon>
                {{ successMessage }}
              </div>
            }

            <button mat-flat-button color="primary" type="submit" class="full-width" [disabled]="isLoading">
              @if (isLoading) {
                <mat-spinner diameter="20"></mat-spinner>
              } @else {
                Registrar
              }
            </button>

            <div class="login-link">
              ¿Ya tienes cuenta? <a routerLink="/login">Iniciar sesión</a>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 24px;
      background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800));
    }

    .register-card {
      width: 100%;
      max-width: 450px;
      padding: 24px;
    }

    mat-card-header {
      margin-bottom: 24px;
    }

    mat-card-title {
      font-size: 24px !important;
      font-weight: 600;
    }

    .full-width {
      width: 100%;
    }

    mat-form-field {
      margin-bottom: 8px;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--color-error-600);
      margin-bottom: 16px;
      font-size: 14px;
    }

    .success-message {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--color-success-600);
      margin-bottom: 16px;
      font-size: 14px;
    }

    button[type="submit"] {
      height: 48px;
      font-size: 16px;
    }

    mat-spinner {
      margin: 0 auto;
    }

    .login-link {
      text-align: center;
      margin-top: 16px;
      color: var(--color-neutral-600);
      
      a {
        color: var(--color-primary-600);
        text-decoration: none;
        font-weight: 500;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  `]
})
export class RegisterPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Form fields
  nombre = '';
  email = '';
  dni='';
  password = '';
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

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const registerData = {
      nombre: this.nombre,
      email: this.email,
      dni: this.dni,
      password: this.password,
      activo: true,
      tipoUsuario: this.tipoUsuario
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = `Usuario creado exitosamente`;
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error al registrar usuario';
      }
    });
  }
}
