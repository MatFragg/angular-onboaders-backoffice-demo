import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
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
          <h2>Restablecer Contraseña</h2>
          @if (tokenValid && !isSuccess && !isValidating) {
            <p>Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta.</p>
          }
        </div>

        @if (isValidating) {
          <div class="loading-state">
            <mat-progress-spinner diameter="40" mode="indeterminate"></mat-progress-spinner>
            <p>Validando enlace...</p>
          </div>
        } @else if (isSuccess) {
          <div class="success-message">
            <mat-icon>check_circle</mat-icon>
            <p>¡Contraseña actualizada con éxito!</p>
            <button mat-flat-button color="primary" routerLink="/login" class="full-width">Iniciar Sesión</button>
          </div>
        } @else if (errorMessage && !tokenValid) {
          <div class="error-panel">
            <mat-icon>error_outline</mat-icon>
            <h3>Enlace no válido</h3>
            <p>{{ errorMessage }}</p>
            <button mat-flat-button color="primary" routerLink="/forgot-password" class="full-width">Solicitar nuevo enlace</button>
          </div>
        } @else {
          <form (ngSubmit)="onSubmit()" #resetForm="ngForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nueva Contraseña</mat-label>
              <input matInput 
                [type]="hidePassword ? 'password' : 'text'" 
                [(ngModel)]="newPassword" 
                name="newPassword" 
                required 
                minlength="8">
              <mat-icon matPrefix>lock</mat-icon>
              <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirmar Nueva Contraseña</mat-label>
              <input matInput 
                [type]="hideConfirmPassword ? 'password' : 'text'" 
                [(ngModel)]="confirmPassword" 
                name="confirmPassword" 
                required>
              <mat-icon matPrefix>lock</mat-icon>
              <button mat-icon-button matSuffix type="button" (click)="hideConfirmPassword = !hideConfirmPassword">
                <mat-icon>{{ hideConfirmPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>

            @if (errorMessage) {
              <div class="error-message">
                <mat-icon>error</mat-icon>
                {{ errorMessage }}
              </div>
            }

            <button mat-flat-button color="primary" type="submit" class="submit-btn" [disabled]="isLoading || !resetForm.form.valid || newPassword !== confirmPassword">
              @if (isLoading) {
                <mat-progress-spinner diameter="20" mode="indeterminate"></mat-progress-spinner>
              } @else {
                Restablecer Contraseña
              }
            </button>
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
      box-shadow: 0 20px 50px rgba(0,0,0,0.3);
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

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 30px;
      p { color: var(--color-neutral-600); font-weight: 500; margin: 0; }
    }

    .error-panel {
      text-align: center;
      padding: 20px 0;
      mat-icon { font-size: 64px; width: 64px; height: 64px; color: var(--color-error-500); margin-bottom: 16px; opacity: 0.8; }
      h3 { font-size: 20px; font-weight: 700; color: var(--color-neutral-900); margin-bottom: 12px; }
      p { color: var(--color-neutral-600); margin-bottom: 24px; line-height: 1.5; }
    }

    mat-progress-spinner { margin: 0 auto; }
  `]
})
export class ResetPasswordPage implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  
  token = '';
  newPassword = '';
  confirmPassword = '';
  
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;
  isValidating = true;
  tokenValid = false;
  isSuccess = false;
  errorMessage = '';

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'] || '';
    if (!this.token) {
      this.isValidating = false;
      this.errorMessage = 'El token de recuperación no es válido o está ausente.';
      return;
    }

    // Validate token immediately on load
    this.authService.validateResetToken(this.token).subscribe({
      next: () => {
        this.isValidating = false;
        this.tokenValid = true;
      },
      error: (err: any) => {
        this.isValidating = false;
        this.tokenValid = false;
        this.errorMessage = err.error?.message || 'El enlace de recuperación es inválido o ha expirado.';
      }
    });
  }

  onSubmit(): void {
    if (!this.token || !this.newPassword) return;

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.resetPassword({
      token: this.token,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSuccess = true;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Hubo un error al restablecer tu contraseña.';
      }
    });
  }
}
