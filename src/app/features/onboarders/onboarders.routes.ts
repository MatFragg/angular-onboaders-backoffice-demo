import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const ONBOARDERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./pages/onboarders-page/onboarders.page')
        .then(m => m.OnboardersPage),
  },
];
