import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/admin-dashboard/admin-dashboard.page').then(m => m.AdminDashboardPage),
    canActivate: [roleGuard],
    data: { roles: ['SUPERADMIN'] }
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./pages/users-list/users-list.page').then(m => m.UsersListPage),
    canActivate: [roleGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN'] }
  },
  {
    path: 'empresas',
    loadComponent: () =>
      import('./pages/empresas-list/empresas-list.page').then(m => m.EmpresasListPage),
    canActivate: [roleGuard],
    data: { roles: ['SUPERADMIN'] }
  },
];

