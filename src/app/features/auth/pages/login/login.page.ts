import { Component, inject } from '@angular/core';

import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>ACJ Onboarder</mat-card-title>
          <mat-card-subtitle>Ingresa tus credenciales</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
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
                required>
              <mat-icon matPrefix>lock</mat-icon>
              <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>

            @if (errorMessage) {
              <div class="error-message">
                <mat-icon>error</mat-icon>
                {{ errorMessage }}
              </div>
            }

            <button mat-flat-button color="primary" type="submit" class="full-width" [disabled]="isLoading">
              @if (isLoading) {
                <mat-spinner diameter="20"></mat-spinner>
              } @else {
                Iniciar Sesión
              }
            </button>

            <div class="register-link">
              ¿No tienes cuenta? <a routerLink="/register">Regístrate</a>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800));
    }

    .login-card {
      width: 100%;
      max-width: 400px;
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
      margin-bottom: 16px;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--color-error-600);
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

    .register-link {
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
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Form fields
  email = '';
  password = '';
  
  hidePassword = true;
  isLoading = false;
  errorMessage = '';

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor ingresa email y contraseña';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        // Redirect to return URL or home
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Credenciales inválidas';
      }
    });
  }
}
