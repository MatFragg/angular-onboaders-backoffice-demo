import { Component, Input, Output, EventEmitter } from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CurrentUser } from '../../../core/models/auth.model';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
}

/**
 * SidebarComponent
 * Reusable sidebar navigation component
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatIconModule
],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() brandTitle = 'ACJ ENROLLMENT';
  @Input() navItems: NavItem[] = [];
  @Input() currentUser: CurrentUser | null = null;
  @Input() userRole: string = '';
  @Output() logoutClicked = new EventEmitter<void>();
}
