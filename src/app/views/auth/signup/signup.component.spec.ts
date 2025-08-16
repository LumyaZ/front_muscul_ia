import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup.component';
import { AuthService } from '../../../services/auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['createUserWithProfile']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        SignupComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize signup form with empty values', () => {
      expect(component.signupForm.get('email')?.value).toBe('');
      expect(component.signupForm.get('password')?.value).toBe('');
      expect(component.signupForm.get('confirmPassword')?.value).toBe('');
      expect(component.signupForm.get('firstName')?.value).toBe('');
      expect(component.signupForm.get('lastName')?.value).toBe('');
      expect(component.signupForm.get('dateOfBirth')?.value).toBe('');
      expect(component.signupForm.get('phoneNumber')?.value).toBe('');
    });

    it('should set isLoading to false on initialization', () => {
      expect(component.isLoading).toBe(false);
    });

    it('should set error to null on initialization', () => {
      expect(component.error).toBeNull();
    });

    it('should set password visibility to false on initialization', () => {
      expect(component.showPassword).toBe(false);
      expect(component.showConfirmPassword).toBe(false);
    });
  });

  describe('Form Validation', () => {
    it('should validate required email field', () => {
      const emailControl = component.signupForm.get('email');
      emailControl?.setValue('');
      expect(emailControl?.hasError('required')).toBe(true);
    });

    it('should validate email format', () => {
      const emailControl = component.signupForm.get('email');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBe(true);
    });

    it('should accept valid email format', () => {
      const emailControl = component.signupForm.get('email');
      emailControl?.setValue('test@example.com');
      expect(emailControl?.hasError('email')).toBe(false);
    });

    it('should validate required password field', () => {
      const passwordControl = component.signupForm.get('password');
      passwordControl?.setValue('');
      expect(passwordControl?.hasError('required')).toBe(true);
    });

    it('should validate password minimum length', () => {
      const passwordControl = component.signupForm.get('password');
      passwordControl?.setValue('Pass1!');
      expect(passwordControl?.hasError('minlength')).toBe(true);
    });

    it('should validate password pattern requirements', () => {
      const passwordControl = component.signupForm.get('password');
      
      passwordControl?.setValue('password123!');
      expect(passwordControl?.hasError('pattern')).toBe(true);
      
      passwordControl?.setValue('PASSWORD123!');
      expect(passwordControl?.hasError('pattern')).toBe(true);
      
      passwordControl?.setValue('Password!');
      expect(passwordControl?.hasError('pattern')).toBe(true);
      
      passwordControl?.setValue('Password123');
      expect(passwordControl?.hasError('pattern')).toBe(true);
      
      passwordControl?.setValue('Password123!');
      expect(passwordControl?.hasError('pattern')).toBe(false);
    });

    it('should validate required confirm password field', () => {
      const confirmPasswordControl = component.signupForm.get('confirmPassword');
      confirmPasswordControl?.setValue('');
      expect(confirmPasswordControl?.hasError('required')).toBe(true);
    });

    it('should validate password match', () => {
      component.signupForm.patchValue({
        password: 'Password123!',
        confirmPassword: 'DifferentPassword123!'
      });
      expect(component.signupForm.hasError('passwordMismatch')).toBe(true);
    });

    it('should accept matching passwords', () => {
      component.signupForm.patchValue({
        password: 'Password123!',
        confirmPassword: 'Password123!'
      });
      expect(component.signupForm.hasError('passwordMismatch')).toBe(false);
    });

    it('should validate required firstName field', () => {
      const firstNameControl = component.signupForm.get('firstName');
      firstNameControl?.setValue('');
      expect(firstNameControl?.hasError('required')).toBe(true);
    });

    it('should validate firstName minimum length', () => {
      const firstNameControl = component.signupForm.get('firstName');
      firstNameControl?.setValue('A');
      expect(firstNameControl?.hasError('minlength')).toBe(true);
    });

    it('should validate required lastName field', () => {
      const lastNameControl = component.signupForm.get('lastName');
      lastNameControl?.setValue('');
      expect(lastNameControl?.hasError('required')).toBe(true);
    });

    it('should validate required dateOfBirth field', () => {
      const dateOfBirthControl = component.signupForm.get('dateOfBirth');
      dateOfBirthControl?.setValue('');
      expect(dateOfBirthControl?.hasError('required')).toBe(true);
    });

    it('should validate phone number format', () => {
      const phoneNumberControl = component.signupForm.get('phoneNumber');
      
      phoneNumberControl?.setValue('123456789');
      expect(phoneNumberControl?.hasError('pattern')).toBe(true);
      
      phoneNumberControl?.setValue('0123456789');
      expect(phoneNumberControl?.hasError('pattern')).toBe(false);
      
      phoneNumberControl?.setValue('+33123456789');
      expect(phoneNumberControl?.hasError('pattern')).toBe(false);
    });

    it('should mark form as valid with correct data', () => {
      component.signupForm.patchValue({
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        phoneNumber: '0123456789'
      });
      expect(component.signupForm.valid).toBe(true);
    });
  });

  describe('Password Strength and Validation', () => {
    it('should calculate password strength correctly', () => {
      const passwordControl = component.signupForm.get('password');
      
      passwordControl?.setValue('pass');
      let strength = component.getPasswordStrength();
      expect(strength.score).toBe(1);
      expect(strength.label).toBe('Faible');
      
      passwordControl?.setValue('Password');
      strength = component.getPasswordStrength();
      expect(strength.score).toBe(2);
      expect(strength.label).toBe('Moyen');
      
      passwordControl?.setValue('Password123');
      strength = component.getPasswordStrength();
      expect(strength.score).toBe(3);
      expect(strength.label).toBe('Bon');
      
      passwordControl?.setValue('Password123!');
      strength = component.getPasswordStrength();
      expect(strength.score).toBe(5);
      expect(strength.label).toBe('Excellent');
    });

    it('should check password requirements correctly', () => {
      const passwordControl = component.signupForm.get('password');
      
      passwordControl?.setValue('Password123!');
      expect(component.hasMinLength()).toBe(true);
      expect(component.hasLowercase()).toBe(true);
      expect(component.hasUppercase()).toBe(true);
      expect(component.hasNumber()).toBe(true);
      expect(component.hasSpecialChar()).toBe(true);
      
      passwordControl?.setValue('pass');
      expect(component.hasMinLength()).toBe(false);
      expect(component.hasUppercase()).toBe(false);
      expect(component.hasNumber()).toBe(false);
      expect(component.hasSpecialChar()).toBe(false);
    });

    it('should get correct password error message', () => {
      const passwordControl = component.signupForm.get('password');
      
      passwordControl?.setValue('');
      passwordControl?.markAsTouched();
      expect(component.getPasswordErrorMessage()).toBe('Le mot de passe est requis.');
      
      passwordControl?.setValue('Pass1!');
      expect(component.getPasswordErrorMessage()).toBe('Le mot de passe doit contenir au moins 12 caractères.');
      
      passwordControl?.setValue('password12345');
      expect(component.getPasswordErrorMessage()).toBe('Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial.');
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

    it('should toggle confirm password visibility', () => {
      expect(component.showConfirmPassword).toBe(false);
      
      component.toggleConfirmPasswordVisibility();
      expect(component.showConfirmPassword).toBe(true);
      
      component.toggleConfirmPasswordVisibility();
      expect(component.showConfirmPassword).toBe(false);
    });
  });

  describe('Form Submission', () => {
    it('should call authService.createUserWithProfile with form data', () => {
      const mockResponse = {
        user: { id: 1, email: 'test@example.com', creationDate: '2024-01-01' },
        profile: { id: 1, userId: 1, firstName: 'John', lastName: 'Doe' },
        token: 'mock-token'
      };
      authService.createUserWithProfile.and.returnValue(of(mockResponse));

      component.signupForm.patchValue({
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        phoneNumber: '0123456789'
      });

      component.onSubmit();

      expect(authService.createUserWithProfile).toHaveBeenCalledWith({
        userData: {
          email: 'test@example.com',
          password: 'Password123!',
          confirmPassword: 'Password123!'
        },
        profileData: {
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01',
          phoneNumber: '0123456789'
        }
      });
    });

    it('should set isLoading to true during submission', () => {
      const mockResponse = {
        user: { id: 1, email: 'test@example.com', creationDate: '2024-01-01' },
        profile: { id: 1, userId: 1, firstName: 'John', lastName: 'Doe' },
        token: 'mock-token'
      };
      authService.createUserWithProfile.and.returnValue(of(mockResponse));

      component.signupForm.patchValue({
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01'
      });

      component.onSubmit();

      expect(component.isLoading).toBe(false);
    });

    it('should set isLoading to false after successful signup', fakeAsync(() => {
      const mockResponse = {
        user: { id: 1, email: 'test@example.com', creationDate: '2024-01-01' },
        profile: { id: 1, userId: 1, firstName: 'John', lastName: 'Doe' },
        token: 'mock-token'
      };
      authService.createUserWithProfile.and.returnValue(of(mockResponse));

      component.signupForm.patchValue({
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01'
      });

      component.onSubmit();
      tick();

      expect(component.isLoading).toBe(false);
    }));

    it('should clear error message on successful signup', fakeAsync(() => {
      component.error = 'Previous error';
      const mockResponse = {
        user: { id: 1, email: 'test@example.com', creationDate: '2024-01-01' },
        profile: { id: 1, userId: 1, firstName: 'John', lastName: 'Doe' },
        token: 'mock-token'
      };
      authService.createUserWithProfile.and.returnValue(of(mockResponse));

      component.signupForm.patchValue({
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01'
      });

      component.onSubmit();
      tick();

      expect(component.error).toBeNull();
    }));

    it('should handle 409 error (email already exists)', fakeAsync(() => {
      authService.createUserWithProfile.and.returnValue(throwError(() => ({ status: 409 })));
      
      component.signupForm.patchValue({
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01'
      });
      
      component.onSubmit();
      tick();
      
      expect(component.error).toBe('Un compte avec cet email existe déjà.');
      expect(component.isLoading).toBe(false);
    }));

    it('should handle 400 error (invalid data)', fakeAsync(() => {
      authService.createUserWithProfile.and.returnValue(throwError(() => ({ status: 400 })));
      
      component.signupForm.patchValue({
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01'
      });
      
      component.onSubmit();
      tick();
      
      expect(component.error).toBe('Veuillez vérifier les informations saisies.');
      expect(component.isLoading).toBe(false);
    }));

    it('should handle 0 error (connection issue)', fakeAsync(() => {
      authService.createUserWithProfile.and.returnValue(throwError(() => ({ status: 0 })));
      
      component.signupForm.patchValue({
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01'
      });
      
      component.onSubmit();
      tick();
      
      expect(component.error).toBe('Impossible de se connecter au serveur. Vérifiez votre connexion.');
      expect(component.isLoading).toBe(false);
    }));

    it('should handle generic error', fakeAsync(() => {
      authService.createUserWithProfile.and.returnValue(throwError(() => ({ status: 500 })));
      
      component.signupForm.patchValue({
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01'
      });
      
      component.onSubmit();
      tick();
      
      expect(component.error).toBe('Une erreur est survenue lors de la création du compte. Veuillez réessayer.');
      expect(component.isLoading).toBe(false);
    }));

    it('should not submit if form is invalid', () => {
      component.signupForm.patchValue({
        email: 'invalid-email',
        password: '123',
        confirmPassword: 'different',
        firstName: '',
        lastName: '',
        dateOfBirth: ''
      });

      component.onSubmit();

      expect(authService.createUserWithProfile).not.toHaveBeenCalled();
    });

    it('should handle form with optional phone number', () => {
      const mockResponse = {
        user: { id: 1, email: 'test@example.com', creationDate: '2024-01-01' },
        profile: { id: 1, userId: 1, firstName: 'John', lastName: 'Doe' },
        token: 'mock-token'
      };
      authService.createUserWithProfile.and.returnValue(of(mockResponse));

      component.signupForm.patchValue({
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        phoneNumber: ''
      });

      component.onSubmit();

      expect(authService.createUserWithProfile).toHaveBeenCalledWith({
        userData: {
          email: 'test@example.com',
          password: 'Password123!',
          confirmPassword: 'Password123!'
        },
        profileData: {
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01',
          phoneNumber: ''
        }
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate to login page', () => {
      component.goToLogin();
      
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should navigate to training-info after successful signup', fakeAsync(() => {
      const mockResponse = {
        user: { id: 1, email: 'test@example.com', creationDate: '2024-01-01' },
        profile: { id: 1, userId: 1, firstName: 'John', lastName: 'Doe' },
        token: 'mock-token'
      };
      authService.createUserWithProfile.and.returnValue(of(mockResponse));

      component.signupForm.patchValue({
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01'
      });

      component.onSubmit();
      tick();

      expect(router.navigate).toHaveBeenCalledWith(['/training-info']);
    }));
  });

  describe('Field Validation', () => {
    it('should return true for invalid field that has been touched', () => {
      const emailControl = component.signupForm.get('email');
      emailControl?.setValue('');
      emailControl?.markAsTouched();

      expect(component.isFieldInvalid('email')).toBe(true);
    });

    it('should return false for valid field', () => {
      const emailControl = component.signupForm.get('email');
      emailControl?.setValue('test@example.com');

      expect(component.isFieldInvalid('email')).toBe(false);
    });

    it('should return false for untouched invalid field', () => {
      const emailControl = component.signupForm.get('email');
      emailControl?.setValue('');

      expect(component.isFieldInvalid('email')).toBe(false);
    });
  });

  describe('Utility Methods', () => {
    it('should return max date for age validation', () => {
      const maxDate = component.getMaxDate();
      const today = new Date().toISOString().split('T')[0];
      expect(maxDate).toBe(today);
    });

    it('should clear error when field changes', () => {
      component.error = 'Test error message';
      
      component.onFieldChange();
      
      expect(component.error).toBeNull();
    });
  });
});
