import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Role Guard
 * Protects routes that require specific roles
 * Usage: canActivate: [roleGuard], data: { roles: ['ADMIN'] }
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // First check if user is authenticated
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // Get required roles from route data
  const requiredRoles = route.data['roles'] as string[] | undefined;
  
  // If no roles specified, allow access
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // Check if user has at least one of the required roles
  const hasRequiredRole = requiredRoles.some(role => authService.hasRole(role));
  
  if (!hasRequiredRole) {
    // Redirect to onboarders if user doesn't have required role
    router.navigate(['/onboarders']);
    return false;
  }

  return true;
};
