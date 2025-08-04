import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { STORAGE_KEYS, HTTP_STATUS } from '../constants/storage.constants';

/**
 * HTTP interceptor to add JWT token to all requests.
 * Intercepteur HTTP pour ajouter le token JWT à toutes les requêtes.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === HTTP_STATUS.UNAUTHORIZED || error.status === HTTP_STATUS.FORBIDDEN) {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
      
      return throwError(() => error);
    })
  );
};