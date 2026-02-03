import { Routes } from '@angular/router';

export const ONBOARDERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./pages/onboarders-page/onboarders.page')
        .then(m => m.OnboardersPage),
  },
];
