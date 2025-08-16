import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { STORAGE_KEYS, HTTP_STATUS } from '../constants/storage.constants';

/**
 * HTTP interceptor to add JWT token to all requests.
 * Intercepteur HTTP pour ajouter le token JWT à toutes les requêtes.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('🔍 === AUTH INTERCEPTOR CALLED ===');
  console.log('URL:', req.url);
  console.log('Method:', req.method);
  
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  console.log('Token présent:', !!token);
  if (token) {
    console.log('Token (premiers 20 chars):', token.substring(0, 20) + '...');
  }
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Headers ajoutés:', req.headers);
  } else {
    console.log('️ Pas de token trouvé dans localStorage');
  }
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('=== ERREUR DANS L\'INTERCEPTEUR ===');
      console.log('URL:', req.url);
      console.log('Status:', error.status);
      console.log('Status Text:', error.statusText);
      console.log('Error:', error.error);
      console.log('Headers de la requête:', req.headers);
      
      if (error.status === HTTP_STATUS.UNAUTHORIZED || error.status === HTTP_STATUS.FORBIDDEN) {
        if (error.error && typeof error.error === 'object' && error.error.message) {
          console.warn(`Auth interceptor: Clearing localStorage due to ${error.status} error for URL: ${req.url}`, error.error.message);
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        } else if (error.status === HTTP_STATUS.UNAUTHORIZED) {
          console.warn(`Auth interceptor: Clearing localStorage due to 401 UNAUTHORIZED for URL: ${req.url}`);
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        } else {
          console.warn(`Auth interceptor: 403 FORBIDDEN error for URL: ${req.url} - not clearing localStorage yet`);
        }
      }
      
      return throwError(() => error);
    })
  );
};