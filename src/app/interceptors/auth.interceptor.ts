import { HttpInterceptorFn } from '@angular/common/http';

/**
 * HTTP interceptor to add JWT token to all requests.
 * Intercepteur HTTP pour ajouter le token JWT à toutes les requêtes.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req);
};