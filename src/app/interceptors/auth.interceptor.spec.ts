import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { authInterceptor } from './auth.interceptor';

/**
 * Tests for authentication interceptor.
 * Tests pour l'intercepteur d'authentification.
 */
describe('authInterceptor', () => {
  beforeEach(() => {
    // Clear localStorage before each test
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
    const token = 'jwt.token.here';
    localStorage.setItem('auth_token', token);

    const request = new HttpRequest('GET', '/api/test');
    const next = (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
      expect(req.headers.has('Authorization')).toBe(true);
      expect(req.headers.get('Authorization')).toBe(`Bearer ${token}`);
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
   * Test handling GET method with authorization header.
   * Test de gestion de la méthode GET avec header d'autorisation.
   */
  it('should handle GET method with authorization header', () => {
    const token = 'jwt.token.here';
    localStorage.setItem('auth_token', token);

    const request = new HttpRequest('GET', '/api/test');
    const next = (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
      expect(req.headers.has('Authorization')).toBe(true);
      expect(req.headers.get('Authorization')).toBe(`Bearer ${token}`);
      return of(new HttpResponse({ status: 200 }));
    };
    
    authInterceptor(request, next).subscribe();
  });

  /**
   * Test handling requests to different URLs.
   * Test de gestion des requêtes vers différentes URLs.
   */
  it('should handle requests to different URLs', () => {
    const token = 'jwt.token.here';
    localStorage.setItem('auth_token', token);

    const urls = [
      '/api/auth/login',
      '/api/auth/register',
      '/api/user/profile',
      '/api/training-info'
    ];

    urls.forEach(url => {
      const request = new HttpRequest('GET', url);
      const next = (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        expect(req.headers.has('Authorization')).toBe(true);
        return of(new HttpResponse({ status: 200 }));
      };
      
      authInterceptor(request, next).subscribe();
    });
  });

  /**
   * Test token format in Authorization header.
   * Test du format du token dans le header d'autorisation.
   */
  it('should format token correctly in Authorization header', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    localStorage.setItem('auth_token', token);

    const request = new HttpRequest('GET', '/api/test');
    const next = (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
      expect(req.headers.get('Authorization')).toBe(`Bearer ${token}`);
      return of(new HttpResponse({ status: 200 }));
    };

    authInterceptor(request, next).subscribe();
  });
}); 