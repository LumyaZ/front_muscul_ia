import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService, LoginRequest, RegisterRequest } from './auth.service';
import { User } from '../models/user.model';
import { CreateUserWithProfileRequest } from '../models/user-profile.model';

/**
 * Tests for authentication service.
 * Tests pour le service d'authentification.
 */
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  /**
   * Test successful login.
   * Test de connexion réussie.
   */
  describe('login', () => {
    it('should login user and save auth data', () => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockResponse = {
        user: { id: 1, email: 'test@example.com', creationDate: '2024-01-01' },
        token: 'jwt.token.here'
      };

      service.login(loginRequest).subscribe();

      const req = httpMock.expectOne('http://localhost:8080/api/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginRequest);

      req.flush(mockResponse);

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
      expect(localStorage.getItem('auth_token')).toBe('jwt.token.here');
      expect(localStorage.getItem('current_user')).toBe(JSON.stringify(mockResponse.user));
    });
  });

  /**
   * Test successful signup.
   * Test d'inscription réussie.
   */
  describe('signup', () => {
    it('should register user and save auth data', () => {
      const signupRequest: RegisterRequest = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      };

      const mockResponse = {
        user: { id: 1, email: 'test@example.com', creationDate: '2024-01-01' },
        token: 'jwt.token.here'
      };

      service.signup(signupRequest).subscribe();

      const req = httpMock.expectOne('http://localhost:8080/api/auth/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(signupRequest);

      req.flush(mockResponse);

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
      expect(localStorage.getItem('auth_token')).toBe('jwt.token.here');
      expect(localStorage.getItem('current_user')).toBe(JSON.stringify(mockResponse.user));
    });
  });

  /**
   * Test create user with profile.
   * Test de création d'utilisateur avec profil.
   */
  describe('createUserWithProfile', () => {
    it('should create user with profile', () => {
      const request: CreateUserWithProfileRequest = {
        userData: {
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123'
        },
        profileData: {
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01',
          phoneNumber: '1234567890'
        }
      };

      const mockResponse = {
        user: { id: 1, email: 'test@example.com', creationDate: '2024-01-01' },
        profile: { id: 1, userId: 1, firstName: 'John', lastName: 'Doe' },
        token: 'jwt.token.here'
      };

      service.createUserWithProfile(request).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/auth/create-user-with-profile');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);

      req.flush(mockResponse);
    });
  });

  /**
   * Test get current user.
   * Test de récupération de l'utilisateur actuel.
   */
  describe('getCurrentUser', () => {
    it('should return current user from localStorage', () => {
      const mockUser: User = { id: 1, email: 'test@example.com', creationDate: '2024-01-01' };
      localStorage.setItem('current_user', JSON.stringify(mockUser));

      const result = service.getCurrentUser();
      expect(result).toEqual(mockUser);
    });

    it('should return null when no user in localStorage', () => {
      const result = service.getCurrentUser();
      expect(result).toBeNull();
    });
  });

  /**
   * Test get token.
   * Test de récupération du token.
   */
  describe('getToken', () => {
    it('should return token from localStorage', () => {
      const token = 'jwt.token.here';
      localStorage.setItem('auth_token', token);

      const result = service.getToken();
      expect(result).toBe(token);
    });

    it('should return null when no token in localStorage', () => {
      const result = service.getToken();
      expect(result).toBeNull();
    });
  });

  /**
   * Test authentication check.
   * Test de vérification d'authentification.
   */
  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('auth_token', 'jwt.token.here');

      const result = service.isAuthenticated();
      expect(result).toBe(true);
    });

    it('should return false when no token exists', () => {
      const result = service.isAuthenticated();
      expect(result).toBe(false);
    });
  });

  /**
   * Test logout.
   * Test de déconnexion.
   */
  describe('logout', () => {
    it('should clear localStorage and navigate to login', () => {
      localStorage.setItem('auth_token', 'jwt.token.here');
      localStorage.setItem('current_user', '{"id": 1}');

      service.logout();

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('current_user')).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
}); 