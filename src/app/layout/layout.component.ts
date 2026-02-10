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
  
  // Base nav items visible to all authenticated users
  private baseNavItems: NavItem[] = [
    { label: 'Onboarders', icon: 'people', route: '/onboarders' },
  ];
  
  // Admin-only nav items
  private adminNavItems: NavItem[] = [
    { label: 'Usuarios', icon: 'manage_accounts', route: '/admin/users' },
    { label: 'Empresas', icon: 'business', route: '/admin/empresas' },
  ];
  
  // Computed nav items based on user role
  navItems = computed(() => {
    const items = [...this.baseNavItems];
    if (this.authService.isAdmin()) {
      items.push(...this.adminNavItems);
    }
    return items;
  });

  onLogout(): void {
    this.authService.logout();
  }
}
