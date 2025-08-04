import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LoginRequest, RegisterRequest } from '../models/user.model';
import { User } from '../models/user.model';
import { CreateUserWithProfileRequest } from '../models/user-profile.model';
import { environment } from '../../environments/environment';

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

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

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

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginRequest);

      req.flush(mockResponse);

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
      expect(localStorage.getItem('auth_token')).toBe('jwt.token.here');
      expect(localStorage.getItem('current_user')).toBe(JSON.stringify(mockResponse.user));
    });
  });

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

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(signupRequest);

      req.flush(mockResponse);

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
      expect(localStorage.getItem('auth_token')).toBe('jwt.token.here');
      expect(localStorage.getItem('current_user')).toBe(JSON.stringify(mockResponse.user));
    });
  });

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
        profile: { id: 1, userId: 1, firstName: 'John', lastName: 'Doe' }
      };

      service.createUserWithProfile(request).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/create-user-with-profile`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);

      req.flush(mockResponse);
    });
  });

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