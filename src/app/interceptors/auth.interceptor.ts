import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

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
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('=== AUTH INTERCEPTOR ERROR ===');
      console.error('Error status:', error.status);
      console.error('Error message:', error.message);
      console.error('Error URL:', error.url);
      
      if (error.status === 403 || error.status === 401) {
        console.error('Authentication error detected, clearing token');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
      }
      
      return throwError(() => error);
    })
  );
};