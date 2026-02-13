import { Component, inject, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SidebarComponent, NavItem } from '../shared/components/sidebar/sidebar.component';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent
],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  private authService = inject(AuthService);
  
  brandTitle = 'ACJ ENROLLMENT';
  
  // Computed nav items based on user role
  navItems = computed(() => {
    // Defines nav items with their required roles
    // No roles means verified user (all authenticated)
    const allItems: (NavItem & { roles?: string[] })[] = [
      { label: 'Onboarders', icon: 'people', route: '/onboarders', roles: ['SUPERADMIN', 'ADMIN', 'USER'] },
      { label: 'Usuarios', icon: 'manage_accounts', route: '/admin/users', roles: ['SUPERADMIN', 'ADMIN'] },
      { label: 'Empresas', icon: 'business', route: '/admin/empresas', roles: ['SUPERADMIN'] },
    ];

    // Filter items based on current user roles
    return allItems.filter(item => {
      // If no specific roles defined, show to everyone
      if (!item.roles || item.roles.length === 0) return true;
      
      // Check if user has at least one of the required roles for this item
      return item.roles.some(role => this.authService.hasRole(role));
    });
  });

  onLogout(): void {
    this.authService.logout();
  }
}
