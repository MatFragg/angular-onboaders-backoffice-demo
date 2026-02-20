import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Public routes (no auth required)
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register/register.page').then(m => m.RegisterPage),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/pages/forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./features/auth/pages/reset-password/reset-password.page').then(m => m.ResetPasswordPage),
  },
  
  // Protected routes (require auth)
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'onboarders',
        pathMatch: 'full',
      },
      {
        path: 'onboarders',
        loadChildren: () => 
          import('./features/onboarders/onboarders.routes')
            .then(m => m.ONBOARDERS_ROUTES),
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./features/admin/admin.routes')
            .then(m => m.ADMIN_ROUTES),
        canActivate: [roleGuard],
        data: { roles: ['SUPERADMIN', 'ADMIN'] },
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
