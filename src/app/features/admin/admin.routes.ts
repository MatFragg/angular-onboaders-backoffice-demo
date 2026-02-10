import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/admin-dashboard/admin-dashboard.page').then(m => m.AdminDashboardPage),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./pages/users-list/users-list.page').then(m => m.UsersListPage),
  },
];

