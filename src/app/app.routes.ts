import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public routes (no auth required)
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.page').then(m => m.LoginPage),
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
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
