import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthService, AuthResponse } from './auth.service';
import { environment } from '../../environments/environment';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';
import { CreateUserWithProfileRequest, CreateUserWithProfileResponse } from '../models/user-profile.model';
import { STORAGE_KEYS } from '../constants/storage.constants';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    creationDate: '2024-01-01T00:00:00Z'
  };

  const mockAuthResponse: AuthResponse = {
    user: mockUser,
    token: 'jwt.token.here'
  };

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

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

      service.login(loginRequest).subscribe(response => {
        expect(response).toEqual(mockAuthResponse);
        expect(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBe(mockAuthResponse.token);
        expect(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)).toBe(JSON.stringify(mockAuthResponse.user));
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginRequest);
      req.flush(mockAuthResponse);
    });

    it('should handle login error', () => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      service.login(loginRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('signup', () => {
    it('should register user and save auth data', () => {
      const registerRequest: RegisterRequest = {
        email: 'new@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      };

      service.signup(registerRequest).subscribe(response => {
        expect(response).toEqual(mockAuthResponse);
        expect(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBe(mockAuthResponse.token);
        expect(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)).toBe(JSON.stringify(mockAuthResponse.user));
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerRequest);
      req.flush(mockAuthResponse);
    });
  });

  describe('getCurrentUser', () => {
    it('should return user from localStorage', () => {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(mockUser));

      const result = service.getCurrentUser();
      expect(result).toEqual(mockUser);
    });

    it('should return null when no user in localStorage', () => {
      const result = service.getCurrentUser();
      expect(result).toBeNull();
    });

    it('should handle invalid JSON in localStorage', () => {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, 'invalid-json');

      spyOn(console, 'error');
      
      const result = service.getCurrentUser();
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith('Error parsing user data from localStorage:', jasmine.any(Error));
      expect(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)).toBeNull(); 
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      const token = 'jwt.token.here';
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);

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
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'jwt.token.here');

      const result = service.isAuthenticated();
      expect(result).toBe(true);
    });

    it('should return false when no token exists', () => {
      const result = service.isAuthenticated();
      expect(result).toBe(false);
    });

    it('should return false when token is empty string', () => {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, '');

      const result = service.isAuthenticated();
      expect(result).toBe(false);
    });
  });

  describe('validateToken', () => {
    it('should return true for valid token', () => {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'valid.token.here');

      service.validateToken().subscribe((result: boolean) => {
        expect(result).toBe(true);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/profiles/me`);
      expect(req.request.method).toBe('GET');
      req.flush({});
    });

    it('should return false for invalid token', () => {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'invalid.token.here');

      service.validateToken().subscribe((result: boolean) => {
        expect(result).toBe(false);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/profiles/me`);
      req.flush({}, { status: 401, statusText: 'Unauthorized' });
    });

    it('should return false when no token exists', () => {
      service.validateToken().subscribe((result: boolean) => {
        expect(result).toBe(false);
      });
    });

    it('should handle validation error', () => {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'valid.token.here');

      service.validateToken().subscribe((result: boolean) => {
        expect(result).toBe(false);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/profiles/me`);
      req.flush({}, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('logout', () => {
    it('should clear localStorage and navigate to login', () => {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'jwt.token.here');
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, '{"id": 1}');

      service.logout();

      expect(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)).toBeNull();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('createUserWithProfile', () => {
    it('should create user with profile and save auth data', () => {
      const createRequest: CreateUserWithProfileRequest = {
        userData: {
          email: 'new@example.com',
          password: 'password123',
          confirmPassword: 'password123'
        },
        profileData: {
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01',
          phoneNumber: '0123456789'
        }
      };

      const mockResponse: CreateUserWithProfileResponse = {
        user: {
          id: 1,
          email: 'new@example.com',
          creationDate: '2024-01-01T00:00:00Z'
        },
        profile: {
          id: 1,
          userId: 1,
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01',
          phoneNumber: '0123456789',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        token: 'jwt.token.here'
      };

      service.createUserWithProfile(createRequest).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBe(mockResponse.token);
        expect(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)).toBe(JSON.stringify(mockResponse.user));
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/create-user-with-profile`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createRequest);
      req.flush(mockResponse);
    });
  });
});