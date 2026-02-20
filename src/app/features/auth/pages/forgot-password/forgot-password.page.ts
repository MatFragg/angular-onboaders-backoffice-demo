import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="auth-wrapper">
      <div class="geometric-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
      </div>

      <div class="auth-card">
        <div class="auth-header">
          <div class="brand">
            <mat-icon>security</mat-icon>
            <span>ACJ Onboarders</span>
          </div>
          <h2>Recuperar Contraseña</h2>
          @if (!isSuccess) {
            <p>Ingresa tu correo electrónico y te enviaremos un link para restablecer tu contraseña.</p>
          }
        </div>

        @if (isSuccess) {
          <div class="success-message">
            <mat-icon>check_circle</mat-icon>
            <p>Se ha enviado un correo de recuperación. Por favor revisa tu bandeja de entrada.</p>
            <button mat-flat-button color="primary" routerLink="/login" class="full-width">Volver al Login</button>
          </div>
        } @else {
          <form (ngSubmit)="onSubmit()" #forgotForm="ngForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Correo Electrónico</mat-label>
              <input matInput 
                type="email" 
                [(ngModel)]="email" 
                name="email" 
                placeholder="usuario@acj.com" 
                required 
                email>
              <mat-icon matPrefix>email</mat-icon>
            </mat-form-field>

            @if (errorMessage) {
              <div class="error-message">
                <mat-icon>error</mat-icon>
                {{ errorMessage }}
              </div>
            }

            <button mat-flat-button color="primary" type="submit" class="submit-btn" [disabled]="isLoading || !forgotForm.form.valid">
              @if (isLoading) {
                <mat-progress-spinner diameter="20" mode="indeterminate"></mat-progress-spinner>
              } @else {
                Enviar Link de Recuperación
              }
            </button>

            <div class="auth-footer">
              <a routerLink="/login" class="back-link">
                <mat-icon>arrow_back</mat-icon>
                Volver al Login
              </a>
            </div>
          </form>
        }
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: var(--color-primary-900);
      position: relative;
      overflow: hidden;
      padding: 20px;
    }

    /* Geometric Shapes */
    .geometric-shapes {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }

    .shape {
      position: absolute;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 40px;
    }

    .shape-1 {
      width: 400px;
      height: 400px;
      top: -100px;
      right: -100px;
      transform: rotate(45deg);
    }

    .shape-2 {
      width: 300px;
      height: 300px;
      bottom: -50px;
      left: -50px;
      transform: rotate(-15deg);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .auth-card {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 450px;
      background: white;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 32px;

      .brand {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: var(--color-primary-900);
        font-weight: 700;
        margin-bottom: 16px;
        mat-icon { font-size: 24px; width: 24px; height: 24px; color: var(--color-primary-600); }
      }

      h2 { font-size: 24px; font-weight: 700; color: var(--color-neutral-900); margin-bottom: 8px; }
      p { color: var(--color-neutral-600); font-size: 14px; }
    }

    .full-width { width: 100%; }

    .submit-btn {
      width: 100%;
      height: 48px;
      margin-top: 16px;
      font-weight: 600;
    }

    .success-message {
      text-align: center;
      padding: 24px;
      background: var(--color-success-50);
      border-radius: 12px;
      color: var(--color-success-700);
      
      mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 16px; color: var(--color-success-500); }
      p { margin-bottom: 24px; font-weight: 500; }
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--color-error-700);
      background: var(--color-error-50);
      padding: 12px;
      border-radius: 8px;
      margin: 16px 0;
      font-size: 14px;
      mat-icon { font-size: 20px; width: 20px; height: 20px; color: var(--color-error-500); }
    }

    .auth-footer {
      margin-top: 32px;
      text-align: center;
      
      .back-link {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        color: var(--color-neutral-600);
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        transition: color 0.2s;
        &:hover { color: var(--color-primary-600); }
        mat-icon { font-size: 18px; width: 18px; height: 18px; }
      }
    }

    mat-progress-spinner { margin: 0 auto; }
  `]
})
export class ForgotPasswordPage {
  private authService = inject(AuthService);
  
  email = '';
  isLoading = false;
  isSuccess = false;
  errorMessage = '';

  onSubmit(): void {
    if (!this.email) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSuccess = true;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Hubo un error al procesar tu solicitud.';
      }
    });
  }
}
