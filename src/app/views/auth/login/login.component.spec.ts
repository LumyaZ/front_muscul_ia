import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../services/auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Unit tests for LoginComponent.
 * Tests unitaires pour LoginComponent.
 */
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'getCurrentUser']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize login form with empty values', () => {
      expect(component.loginForm.get('email')?.value).toBe('');
      expect(component.loginForm.get('password')?.value).toBe('');
    });

    it('should set isLoading to false on initialization', () => {
      expect(component.isLoading).toBe(false);
    });

    it('should set error to null on initialization', () => {
      expect(component.error).toBeNull();
    });
  });

  describe('Form Validation', () => {
    it('should validate required email field', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('');
      expect(emailControl?.hasError('required')).toBe(true);
    });

    it('should validate email format', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBe(true);
    });

    it('should accept valid email format', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('test@example.com');
      expect(emailControl?.hasError('email')).toBe(false);
    });

    it('should validate required password field', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('');
      expect(passwordControl?.hasError('required')).toBe(true);
    });

    it('should validate password minimum length', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('123');
      expect(passwordControl?.hasError('minlength')).toBe(true);
    });

    it('should accept valid password', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('password123');
      expect(passwordControl?.hasError('minlength')).toBe(false);
    });

    it('should mark form as valid with correct data', () => {
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });
      expect(component.loginForm.valid).toBe(true);
    });
  });

  describe('Form Submission', () => {
    it('should call authService.login with form data', () => {
      const formData = {
        email: 'test@example.com',
        password: 'password123'
      };
      component.loginForm.patchValue(formData);
      authService.login.and.returnValue(of({ user: { id: 1, email: 'test@example.com', creationDate: '2024-01-01' }, token: 'jwt.token.here' }));

      component.onSubmit();

      expect(authService.login).toHaveBeenCalledWith(formData);
    });

    it('should set isLoading to true during submission', () => {
      authService.login.and.returnValue(of({ user: { id: 1, email: 'test@example.com', creationDate: '2024-01-01' }, token: 'jwt.token.here' }));

      component.onSubmit();

      expect(component.isLoading).toBe(false);
    });

    it('should set isLoading to false after successful login', fakeAsync(() => {
      authService.login.and.returnValue(of({ user: { id: 1, email: 'test@example.com', creationDate: '2024-01-01' }, token: 'jwt.token.here' }));

      component.onSubmit();
      tick();

      expect(component.isLoading).toBe(false);
    }));

    it('should clear error message on successful login', fakeAsync(() => {
      component.error = 'Previous error';
      const mockResponse = { user: { id: 1, email: 'test@example.com' }, token: 'jwt-token' };
      authService.login.and.returnValue(of(mockResponse));

      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });

      component.onSubmit();
      tick();

      expect(component.error).toBeNull();
    }));

    it('should handle login error and display error message', fakeAsync(() => {
      const errorResponse = { status: 401, error: { message: 'Invalid credentials' } };
      authService.login.and.returnValue(throwError(() => errorResponse));

      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });

      component.onSubmit();
      tick();

      expect(component.error).toBe('Email ou mot de passe incorrect');
      expect(component.isLoading).toBe(false);
    }));

    it('should handle network error', fakeAsync(() => {
      const errorResponse = { status: 0 };
      authService.login.and.returnValue(throwError(() => errorResponse));

      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });

      component.onSubmit();
      tick();

      expect(component.error).toBe('Impossible de se connecter au serveur. Vérifiez votre connexion.');
      expect(component.isLoading).toBe(false);
    }));

    it('should handle error without message', fakeAsync(() => {
      const errorResponse = { status: 500 };
      authService.login.and.returnValue(throwError(() => errorResponse));

      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });

      component.onSubmit();
      tick();

      expect(component.error).toBe('Une erreur est survenue lors de la connexion. Veuillez réessayer.');
      expect(component.isLoading).toBe(false);
    }));

    it('should not submit if form is invalid', () => {
      component.loginForm.patchValue({
        email: 'invalid-email',
        password: ''
      });

      component.onSubmit();

      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should not submit if already loading', () => {
      component.isLoading = true;

      component.onSubmit();

      expect(authService.login).not.toHaveBeenCalled();
    });
  });



  describe('Navigation', () => {
    it('should navigate to signup page', () => {
      component.goToSignup();

      expect(router.navigate).toHaveBeenCalledWith(['/signup']);
    });
  });

  describe('Password Visibility', () => {
    it('should toggle password visibility', () => {
      expect(component.showPassword).toBe(false);

      component.togglePasswordVisibility();
      expect(component.showPassword).toBe(true);

      component.togglePasswordVisibility();
      expect(component.showPassword).toBe(false);
    });
  });

  describe('Field Validation', () => {
    it('should return true for invalid field that has been touched', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('');
      emailControl?.markAsTouched();

      expect(component.isFieldInvalid('email')).toBe(true);
    });

    it('should return false for valid field', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('test@example.com');

      expect(component.isFieldInvalid('email')).toBe(false);
    });

    it('should return false for untouched invalid field', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('');

      expect(component.isFieldInvalid('email')).toBe(false);
    });
  });
});
