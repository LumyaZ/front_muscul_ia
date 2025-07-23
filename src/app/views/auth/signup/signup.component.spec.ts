import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup.component';
import { AuthService } from '../../../services/auth.service';
import { of } from 'rxjs';
import { CreateUserWithProfileResponse } from '../../../models/user-profile.model';

/**
 * Basic unit test for SignupComponent.
 * Test unitaire de base pour SignupComponent.
 */
describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['createUserWithProfile']);

    await TestBed.configureTestingModule({
      imports: [
        SignupComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(
      AuthService,
    ) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form initially', () => {
    expect(component.signupForm.valid).toBeFalsy();
  });

  it('should have a valid form with correct data', () => {
    component.signupForm.patchValue({
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      phoneNumber: '0123456789'
    });
    expect(component.signupForm.valid).toBeTruthy();
  });

  it('should have invalid form when passwords do not match', () => {
    component.signupForm.patchValue({
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'DifferentPassword123!',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01'
    });
    expect(component.signupForm.valid).toBeFalsy();
    expect(component.signupForm.errors?.['passwordMismatch']).toBeTruthy();
  });

  it('should validate password requirements', () => {
    const passwordControl = component.signupForm.get('password');
    
    // Test mot de passe trop court
    passwordControl?.setValue('Pass1!');
    expect(passwordControl?.errors?.['minlength']).toBeTruthy();
    
    // Test mot de passe sans majuscule
    passwordControl?.setValue('password123!');
    expect(passwordControl?.errors?.['pattern']).toBeTruthy();
    
    // Test mot de passe sans minuscule
    passwordControl?.setValue('PASSWORD123!');
    expect(passwordControl?.errors?.['pattern']).toBeTruthy();
    
    // Test mot de passe sans chiffre
    passwordControl?.setValue('Password!');
    expect(passwordControl?.errors?.['pattern']).toBeTruthy();
    
    // Test mot de passe sans caractère spécial
    passwordControl?.setValue('Password123');
    expect(passwordControl?.errors?.['pattern']).toBeTruthy();
    
    // Test mot de passe valide
    passwordControl?.setValue('Password123!');
    expect(passwordControl?.errors).toBeNull();
  });

  it('should calculate password strength correctly', () => {
    const passwordControl = component.signupForm.get('password');
    
    // Test force très faible
    passwordControl?.setValue('pass');
    let strength = component.getPasswordStrength();
    expect(strength.score).toBe(1);
    expect(strength.label).toBe('Très faible');
    
    // Test force faible
    passwordControl?.setValue('password');
    strength = component.getPasswordStrength();
    expect(strength.score).toBe(2);
    expect(strength.label).toBe('Faible');
    
    // Test force moyenne
    passwordControl?.setValue('Password');
    strength = component.getPasswordStrength();
    expect(strength.score).toBe(3);
    expect(strength.label).toBe('Moyen');
    
    // Test force forte
    passwordControl?.setValue('Password123');
    strength = component.getPasswordStrength();
    expect(strength.score).toBe(4);
    expect(strength.label).toBe('Fort');
    
    // Test force très forte
    passwordControl?.setValue('Password123!');
    strength = component.getPasswordStrength();
    expect(strength.score).toBe(5);
    expect(strength.label).toBe('Très fort');
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalse();
    expect(component.showConfirmPassword).toBeFalse();
    
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTrue();
    
    component.toggleConfirmPasswordVisibility();
    expect(component.showConfirmPassword).toBeTrue();
    
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeFalse();
    
    component.toggleConfirmPasswordVisibility();
    expect(component.showConfirmPassword).toBeFalse();
  });

  it('should get correct password error message', () => {
    const passwordControl = component.signupForm.get('password');
    
    passwordControl?.setValue('');
    passwordControl?.markAsTouched();
    expect(component.getPasswordErrorMessage()).toBe('Le mot de passe est obligatoire');
    
    passwordControl?.setValue('Pass1!');
    expect(component.getPasswordErrorMessage()).toBe('Le mot de passe doit contenir au moins 8 caractères');
    
    passwordControl?.setValue('password123');
    expect(component.getPasswordErrorMessage()).toBe('Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial (@$!%*?&)');
  });

  it('should call authService.createUserWithProfile when form is valid', () => {
    const mockResponse: CreateUserWithProfileResponse = {
      user: {
        id: 1,
        email: 'test@example.com',
        creationDate: '2024-01-01T00:00:00'
      },
      profile: {
        id: 1,
        userId: 1,
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        age: 34,
        phoneNumber: '0123456789',
        createdAt: '2024-01-01T00:00:00',
        updatedAt: '2024-01-01T00:00:00'
      }
    };
    mockAuthService.createUserWithProfile.and.returnValue(of(mockResponse));

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

    expect(mockAuthService.createUserWithProfile).toHaveBeenCalledWith({
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

  it('should not call authService.createUserWithProfile when form is invalid', () => {
    component.signupForm.patchValue({
      email: 'invalid-email',
      password: '123',
      confirmPassword: 'different',
      firstName: '',
      lastName: '',
      dateOfBirth: ''
    });

    component.onSubmit();

    expect(mockAuthService.createUserWithProfile).not.toHaveBeenCalled();
  });

  it('should handle form with optional phone number', () => {
    const mockResponse: CreateUserWithProfileResponse = {
      user: {
        id: 1,
        email: 'test@example.com',
        creationDate: '2024-01-01T00:00:00'
      },
      profile: {
        id: 1,
        userId: 1,
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        age: 34,
        phoneNumber: undefined,
        createdAt: '2024-01-01T00:00:00',
        updatedAt: '2024-01-01T00:00:00'
      }
    };
    mockAuthService.createUserWithProfile.and.returnValue(of(mockResponse));

    component.signupForm.patchValue({
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      phoneNumber: '' // Phone number vide
    });

    component.onSubmit();

    expect(mockAuthService.createUserWithProfile).toHaveBeenCalledWith({
      userData: {
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      },
      profileData: {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        phoneNumber: undefined // Devrait être undefined quand vide
      }
    });
  });
});
