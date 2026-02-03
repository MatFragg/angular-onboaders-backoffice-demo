import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent, NavItem } from '../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    SidebarComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  brandTitle = 'ACJ ENROLLMENT';
  
  navItems: NavItem[] = [
    { label: 'Onboarders', icon: 'people', route: '/onboarders' },
    // Add more nav items here as features grow
  ];
}
