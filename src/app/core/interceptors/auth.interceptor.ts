import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Auth Interceptor
 * Adds JWT token to all outgoing HTTP requests
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  console.log('[AuthInterceptor] Request:', req.url, '| Token:', token ? 'present' : 'missing');

  // Skip auth header for login/register endpoints
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    console.log('[AuthInterceptor] Skipping auth for:', req.url);
    return next(req);
  }

  if (token) {
    console.log('[AuthInterceptor] Adding Bearer token to:', req.url);
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  console.log('[AuthInterceptor] No token for:', req.url);
  return next(req);
};
