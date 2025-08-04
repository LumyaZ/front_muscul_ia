import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { authInterceptor } from './auth.interceptor';
import { STORAGE_KEYS, HTTP_STATUS } from '../constants/storage.constants';

/**
 * Test constants.
 * Constantes de test.
 */
const TEST_TOKEN = 'jwt.token.here';

/**
 * Tests for authentication interceptor.
 * Tests pour l'intercepteur d'authentification.
 */
describe('authInterceptor', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  /**
   * Test adding authorization header when token exists.
   * Test d'ajout du header d'autorisation quand le token existe.
   */
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

  /**
   * Test not adding authorization header when no token exists.
   * Test de non-ajout du header d'autorisation quand aucun token n'existe.
   */
  it('should not add Authorization header when no token exists', () => {
    const request = new HttpRequest('GET', '/api/test');
    const next = (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
      expect(req.headers.has('Authorization')).toBe(false);
      return of(new HttpResponse({ status: 200 }));
    };

    authInterceptor(request, next).subscribe();
  });

  /**
   * Test clearing localStorage on authentication errors (401/403).
   * Test de nettoyage du localStorage sur les erreurs d'authentification (401/403).
   */
  it('should clear localStorage on authentication errors', () => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, TEST_TOKEN);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, '{"id": 1, "email": "test@test.com"}');

    const errorStatuses = [HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN];

    errorStatuses.forEach(status => {
      const request = new HttpRequest('GET', '/api/test');
      const next = (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        return throwError(() => new HttpErrorResponse({ status }));
      };

      authInterceptor(request, next).subscribe({
        error: () => {
          expect(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBeNull();
          expect(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)).toBeNull();
        }
      });
    });
  });

  /**
   * Test not clearing localStorage on other errors.
   * Test de non-nettoyage du localStorage sur d'autres erreurs.
   */
  it('should not clear localStorage on other errors', () => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, TEST_TOKEN);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, '{"id": 1, "email": "test@test.com"}');

    const request = new HttpRequest('GET', '/api/test');
    const next = (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
      return throwError(() => new HttpErrorResponse({ status: HTTP_STATUS.INTERNAL_SERVER_ERROR }));
    };

    authInterceptor(request, next).subscribe({
      error: () => {
        expect(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBe(TEST_TOKEN);
        expect(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)).toBe('{"id": 1, "email": "test@test.com"}');
      }
    });
  });
}); 