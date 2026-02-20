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
    <div class="login-page-wrapper">
      <div class="visual-panel">
        <div class="overlay"></div>
        <div class="visual-content">
          <div class="brand-badge">
            <mat-icon>security</mat-icon>
            <span>ACJ Onboarders</span>
          </div>
          <h1>Lorem ipsum dolor sit amet consectetu</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi esse maiores magni vel explicabo assumenda cupiditate quia, expedita eveniet, at consequatur sequi aut ipsum eos possimus nostrum, praesentium vero commodi!</p>
          
          
        </div>
        <div class="geometric-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
        </div>
      </div>

      <div class="form-panel">

        <div class="form-container">
          <div class="form-header">
            <h2>Bienvenido de nuevo</h2>
            <p>Ingresa sus credenciales para acceder al panel de control.</p>
          </div>

          <form (ngSubmit)="onSubmit()" class="login-form">
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

            <div class="form-options">
              <!--
                <label class="checkbox-container">
                  <input type="checkbox"> Recordarme
                </label>
              -->
              <a routerLink="/forgot-password" class="forgot-link">¿Olvidaste tu contraseña?</a>
            </div>

            @if (errorMessage) {
              <div class="error-message">
                <mat-icon>error</mat-icon>
                {{ errorMessage }}
              </div>
            }

            <button mat-flat-button color="primary" type="submit" class="submit-btn" [disabled]="isLoading">
              @if (isLoading) {
                <mat-spinner diameter="20"></mat-spinner>
              } @else {
                <ng-container>
                  <span>Iniciar Sesión</span>
                </ng-container>
              }
            </button>
          </form>

          <footer class="footer">
            <p>© 2026 ACJ Soluciones. Todos los derechos reservados.</p>
          </footer>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      overflow: hidden;
    }

    .login-page-wrapper {
      display: flex;
      height: 100%;
      width: 100%;
    }

    /* Left Panel */
    .visual-panel {
      flex: 0 0 50%;
      background-color: var(--color-primary-900);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 60px;
      color: white;
      overflow: hidden;

      @media (max-width: 960px) {
        display: none;
      }
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.2);
      z-index: 1;
    }

    .visual-content {
      position: relative;
      z-index: 10;
      max-width: 480px;
    }

    .brand-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(255, 255, 255, 0.1);
      padding: 8px 16px;
      border-radius: 50px;
      margin-bottom: 40px;
      font-weight: 500;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);

      mat-icon {
        color: var(--color-primary-200);
      }
    }

    h1 {
      font-size: 42px;
      line-height: 1.2;
      font-weight: 700;
      margin-bottom: 24px;
      color: white;
    }

    p {
      font-size: 18px;
      line-height: 1.6;
      color: var(--color-primary-100);
      margin-bottom: 48px;
      opacity: 0.9;
    }

    /* Stats Card */
    .stats-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 16px 24px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      gap: 16px;
      width: fit-content;

      .avatars {
        display: flex;
        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid var(--color-primary-900);
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: -8px;
          &:first-child { margin-left: 0; }
        }
      }

      .stats-text {
        font-size: 14px;
        strong { display: block; }
        .stars { color: #facc15; margin-top: 2px; }
      }
    }

    /* Geometric Shapes (Replacement for images) */
    .geometric-shapes {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
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

    /* Right Panel */
    .form-panel {
      flex: 1;
      background-color: white;
      display: flex;
      flex-direction: column;
      position: relative;
      padding: 40px;
      overflow-y: auto;
    }

    .header-links {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 10px;
      font-size: 14px;

      .create-account {
        color: var(--color-primary-600);
        text-decoration: none;
        font-weight: 600;
        &:hover { text-decoration: underline; }
      }
    }

    .form-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      max-width: 420px;
      margin: 0 auto;
      width: 100%;
    }

    .form-header {
      h2 {
        font-size: 28px;
        font-weight: 700;
        color: var(--color-neutral-900);
        margin-bottom: 8px;
      }
      p {
        color: var(--color-neutral-600);
        font-size: 15px;
      }
    }

    .full-width {
      width: 100%;
      margin-bottom: 20px;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      font-size: 14px;

      .checkbox-container {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--color-neutral-700);
        cursor: pointer;
      }

      .forgot-link {
        color: var(--color-primary-600);
        text-decoration: none;
        font-weight: 500;
        &:hover { text-decoration: underline; }
      }
    }

    .submit-btn {
      width: 100%;
      height: 52px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 32px;
    }

    .divider {
      position: relative;
      text-align: center;
      margin-bottom: 24px;
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background: var(--color-neutral-200);
      }
      span {
        position: relative;
        background: white;
        padding: 0 16px;
        color: var(--color-neutral-500);
        font-size: 13px;
      }
    }

    .social-login {
      display: flex;
      gap: 16px;
      margin-bottom: 40px;
      
      .social-btn {
        flex: 1;
        height: 48px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        font-size: 14px;
        font-weight: 500;
        
        img {
          width: 18px;
          height: 18px;
        }
      }
    }

    .footer {
      font-size: 13px;
      color: var(--color-neutral-500);
      text-align: center;
      p { margin: 0; color: inherit; font-size: inherit; }
      a {
        color: var(--color-neutral-700);
        text-decoration: none;
        &:hover { text-decoration: underline; }
      }
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--color-error-600);
      background: var(--color-error-100);
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 24px;
      font-size: 14px;
      mat-icon { font-size: 20px; width: 20px; height: 20px; }
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
