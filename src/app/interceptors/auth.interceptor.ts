import { HttpInterceptorFn } from '@angular/common/http';

/**
 * HTTP interceptor to add JWT token to all requests.
 * Intercepteur HTTP pour ajouter le token JWT à toutes les requêtes.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');
  
  console.log('=== AUTH INTERCEPTOR ===');
  console.log('Request URL:', req.url);
  console.log('Token found:', !!token);
  console.log('Token value:', token ? token.substring(0, 20) + '...' : 'null');
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Authorization header added');
  } else {
    console.log('No token found, request sent without Authorization header');
  }
  
  return next(req);
};