import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { authInterceptor } from './auth.interceptor';
import { STORAGE_KEYS, HTTP_STATUS } from '../constants/storage.constants';

describe('authInterceptor', () => {
  const TEST_TOKEN = 'jwt.token.here';

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Request Processing', () => {
    it('should add Authorization header when token exists', () => {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, TEST_TOKEN);

      const request = new HttpRequest('GET', '/api/test');
      const next = (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        expect(req.headers.has('Authorization')).toBe(true);
        expect(req.headers.get('Authorization')).toBe(`Bearer ${TEST_TOKEN}`);
        return of(new HttpResponse({ status: 200 }));
      };

      authInterceptor(request, next).subscribe();
    });

    it('should not add Authorization header when no token exists', () => {
      const request = new HttpRequest('GET', '/api/test');
      const next = (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        expect(req.headers.has('Authorization')).toBe(false);
        return of(new HttpResponse({ status: 200 }));
      };

      authInterceptor(request, next).subscribe();
    });

    it('should handle successful requests without errors', () => {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, TEST_TOKEN);

      const request = new HttpRequest('GET', '/api/test');
      const next = (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        return of(new HttpResponse({ status: 200, body: { success: true } }));
      };

      authInterceptor(request, next).subscribe(response => {
        expect(response).toBeTruthy();
        expect(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBe(TEST_TOKEN);
      });
    });
  });

  describe('Error Handling', () => {
    it('should clear localStorage on 401 error with error.message', () => {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, TEST_TOKEN);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, '{"id": 1, "email": "test@test.com"}');

      const request = new HttpRequest('GET', '/api/test');
      const next = (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        return throwError(() => new HttpErrorResponse({ 
          status: HTTP_STATUS.UNAUTHORIZED,
          error: { message: 'Token expired' }
        }));
      };

      authInterceptor(request, next).subscribe({
        error: () => {
          expect(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBeNull();
          expect(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)).toBeNull();
        }
      });
    });

    it('should clear localStorage on 401 error without error.message', () => {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, TEST_TOKEN);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, '{"id": 1, "email": "test@test.com"}');

      const request = new HttpRequest('GET', '/api/test');
      const next = (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        return throwError(() => new HttpErrorResponse({ 
          status: HTTP_STATUS.UNAUTHORIZED
        }));
      };

      authInterceptor(request, next).subscribe({
        error: () => {
          expect(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBeNull();
          expect(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)).toBeNull();
        }
      });
    });

    it('should not clear localStorage on 403 error', () => {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, TEST_TOKEN);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, '{"id": 1, "email": "test@test.com"}');

      const request = new HttpRequest('GET', '/api/test');
      const next = (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        return throwError(() => new HttpErrorResponse({ 
          status: HTTP_STATUS.FORBIDDEN
        }));
      };

      authInterceptor(request, next).subscribe({
        error: () => {
          expect(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBe(TEST_TOKEN);
          expect(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)).toBe('{"id": 1, "email": "test@test.com"}');
        }
      });
    });

    it('should not clear localStorage on other errors', () => {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, TEST_TOKEN);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, '{"id": 1, "email": "test@test.com"}');

      const request = new HttpRequest('GET', '/api/test');
      const next = (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        return throwError(() => new HttpErrorResponse({ 
          status: HTTP_STATUS.INTERNAL_SERVER_ERROR 
        }));
      };

      authInterceptor(request, next).subscribe({
        error: () => {
          expect(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBe(TEST_TOKEN);
          expect(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)).toBe('{"id": 1, "email": "test@test.com"}');
        }
      });
    });

    it('should rethrow the error after handling', () => {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, TEST_TOKEN);

      const request = new HttpRequest('GET', '/api/test');
      const testError = new HttpErrorResponse({ 
        status: HTTP_STATUS.UNAUTHORIZED,
        error: { message: 'Token expired' }
      });
      const next = (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        return throwError(() => testError);
      };

      authInterceptor(request, next).subscribe({
        error: (error) => {
          expect(error).toBe(testError);
        }
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle requests with existing headers', () => {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, TEST_TOKEN);

      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      const request = new HttpRequest('GET', '/api/test', null, { headers });
      const next = (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        expect(req.headers.has('Authorization')).toBe(true);
        expect(req.headers.has('Content-Type')).toBe(true);
        expect(req.headers.get('Authorization')).toBe(`Bearer ${TEST_TOKEN}`);
        expect(req.headers.get('Content-Type')).toBe('application/json');
        return of(new HttpResponse({ status: 200 }));
      };

      authInterceptor(request, next).subscribe();
    });

    it('should handle GET requests', () => {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, TEST_TOKEN);

      const request = new HttpRequest('GET', '/api/test');
      const next = (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        expect(req.method).toBe('GET');
        expect(req.headers.has('Authorization')).toBe(true);
        return of(new HttpResponse({ status: 200 }));
      };

      authInterceptor(request, next).subscribe();
    });

    it('should handle POST requests', () => {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, TEST_TOKEN);

      const request = new HttpRequest('POST', '/api/test', { data: 'test' });
      const next = (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        expect(req.method).toBe('POST');
        expect(req.headers.has('Authorization')).toBe(true);
        return of(new HttpResponse({ status: 200 }));
      };

      authInterceptor(request, next).subscribe();
    });

    it('should handle PUT requests', () => {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, TEST_TOKEN);

      const request = new HttpRequest('PUT', '/api/test', { data: 'test' });
      const next = (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        expect(req.method).toBe('PUT');
        expect(req.headers.has('Authorization')).toBe(true);
        return of(new HttpResponse({ status: 200 }));
      };

      authInterceptor(request, next).subscribe();
    });

    it('should handle DELETE requests', () => {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, TEST_TOKEN);

      const request = new HttpRequest('DELETE', '/api/test');
      const next = (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        expect(req.method).toBe('DELETE');
        expect(req.headers.has('Authorization')).toBe(true);
        return of(new HttpResponse({ status: 200 }));
      };

      authInterceptor(request, next).subscribe();
    });

    it('should handle PATCH requests', () => {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, TEST_TOKEN);

      const request = new HttpRequest('PATCH', '/api/test', { data: 'test' });
      const next = (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        expect(req.method).toBe('PATCH');
        expect(req.headers.has('Authorization')).toBe(true);
        return of(new HttpResponse({ status: 200 }));
      };

      authInterceptor(request, next).subscribe();
    });
  });
});