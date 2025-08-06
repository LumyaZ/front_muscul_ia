import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup.component';
import { AuthService } from '../../../services/auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Unit tests for SignupComponent.
 * Tests unitaires pour SignupComponent.
 */
describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

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
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  /**
   * Test de création du composant
   * Test component creation
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test que le formulaire est invalide à l'initialisation
   * Test that form is invalid initially
   */
  it('should have an invalid form initially', () => {
    expect(component.signupForm.valid).toBeFalsy();
  });

  /**
   * Test que le formulaire est valide avec des données correctes
   * Test that form is valid with correct data
   */
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

  /**
   * Test que le formulaire est invalide quand les mots de passe ne correspondent pas
   * Test that form is invalid when passwords do not match
   */
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

  /**
   * Test de validation complète des exigences du mot de passe
   * Test complete password requirements validation
   */
  it('should validate password requirements and conditions', () => {
    const passwordControl = component.signupForm.get('password');
    
    passwordControl?.setValue('Pass1!');
    expect(passwordControl?.errors?.['minlength']).toBeTruthy();
    expect(component.hasMinLength()).toBeFalsy();
    
    passwordControl?.setValue('password123!');
    expect(passwordControl?.errors?.['pattern']).toBeTruthy();
    expect(component.hasUppercase()).toBeFalsy();
    
    passwordControl?.setValue('PASSWORD123!');
    expect(passwordControl?.errors?.['pattern']).toBeTruthy();
    expect(component.hasLowercase()).toBeFalsy();
    
    passwordControl?.setValue('Password!');
    expect(passwordControl?.errors?.['pattern']).toBeTruthy();
    expect(component.hasNumber()).toBeFalsy();
    
    passwordControl?.setValue('Password123');
    expect(passwordControl?.errors?.['pattern']).toBeTruthy();
    expect(component.hasSpecialChar()).toBeFalsy();
    
    passwordControl?.setValue('Password123!');
    expect(passwordControl?.errors).toBeNull();
    expect(component.hasMinLength()).toBeTruthy();
    expect(component.hasLowercase()).toBeTruthy();
    expect(component.hasUppercase()).toBeTruthy();
    expect(component.hasNumber()).toBeTruthy();
    expect(component.hasSpecialChar()).toBeTruthy();
  });

  /**
   * Test du calcul de la force du mot de passe
   * Test password strength calculation
   */
  it('should calculate password strength correctly', () => {
    const passwordControl = component.signupForm.get('password');
    
    passwordControl?.setValue('pass');
    let strength = component.getPasswordStrength();
    expect(strength.score).toBe(1);
    expect(strength.label).toBe('Faible');
    
    passwordControl?.setValue('password');
    strength = component.getPasswordStrength();
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

  /**
   * Test du basculement de la visibilité des mots de passe
   * Test password visibility toggle
   */
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

  /**
   * Test des messages d'erreur du mot de passe
   * Test password error messages
   */
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

  /**
   * Test que le service d'authentification est appelé avec les bonnes données
   * Test that auth service is called with correct data
   */
  it('should call authService.createUserWithProfile when form is valid', () => {
    const mockResponse = {
      user: { id: 1, email: 'test@example.com', creationDate: '2024-01-01' },
      profile: { id: 1, userId: 1, firstName: 'John', lastName: 'Doe' },
      token: 'mock-token'
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

  /**
   * Test que le service n'est pas appelé quand le formulaire est invalide
   * Test that service is not called when form is invalid
   */
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

  /**
   * Test de gestion du numéro de téléphone optionnel
   * Test handling of optional phone number
   */
  it('should handle form with optional phone number', () => {
    const mockResponse = {
      user: { id: 1, email: 'test@example.com', creationDate: '2024-01-01' },
      profile: { id: 1, userId: 1, firstName: 'John', lastName: 'Doe' },
      token: 'mock-token'
    };
    mockAuthService.createUserWithProfile.and.returnValue(of(mockResponse));

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
        phoneNumber: ''
      }
    });
  });

  /**
   * Test de gestion de l'erreur 409 (email déjà existant)
   * Test handling of 409 error (email already exists)
   */
  it('should handle 409 error correctly', () => {
    mockAuthService.createUserWithProfile.and.returnValue(throwError(() => ({ status: 409 })));
    
    component.signupForm.patchValue({
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01'
    });
    
    component.onSubmit();
    
    expect(component.error).toBe('Un compte avec cet email existe déjà.');
  });

  /**
   * Test de gestion de l'erreur 400 (données invalides)
   * Test handling of 400 error (invalid data)
   */
  it('should handle 400 error correctly', () => {
    mockAuthService.createUserWithProfile.and.returnValue(throwError(() => ({ status: 400 })));
    
    component.signupForm.patchValue({
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01'
    });
    
    component.onSubmit();
    
    expect(component.error).toBe('Veuillez vérifier les informations saisies.');
  });

  /**
   * Test de gestion de l'erreur 0 (problème de connexion)
   * Test handling of 0 error (connection issue)
   */
  it('should handle 0 error correctly', () => {
    mockAuthService.createUserWithProfile.and.returnValue(throwError(() => ({ status: 0 })));
    
    component.signupForm.patchValue({
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01'
    });
    
    component.onSubmit();
    
    expect(component.error).toBe('Impossible de se connecter au serveur. Vérifiez votre connexion.');
  });

  /**
   * Test de gestion d'erreur générique
   * Test handling of generic error
   */
  it('should handle generic error correctly', () => {
    mockAuthService.createUserWithProfile.and.returnValue(throwError(() => ({ status: 500 })));
    
    component.signupForm.patchValue({
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01'
    });
    
    component.onSubmit();
    
    expect(component.error).toBe('Une erreur est survenue lors de la création du compte. Veuillez réessayer.');
  });

  /**
   * Test de navigation vers la page de connexion
   * Test navigation to login page
   */
  it('should navigate to login page', () => {
    component.goToLogin();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  /**
   * Test de navigation après inscription réussie
   * Test navigation after successful signup
   */
  it('should navigate to training-info after successful signup', () => {
    const mockResponse = {
      user: { id: 1, email: 'test@example.com', creationDate: '2024-01-01' },
      profile: { id: 1, userId: 1, firstName: 'John', lastName: 'Doe' },
      token: 'mock-token'
    };
    mockAuthService.createUserWithProfile.and.returnValue(of(mockResponse));

    component.signupForm.patchValue({
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01'
    });

    component.onSubmit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/training-info']);
  });

  /**
   * Test de sauvegarde des données d'authentification
   * Test saving authentication data
   */
  it('should save auth data to localStorage after successful signup', () => {
    const mockResponse = {
      user: { id: 1, email: 'test@example.com', creationDate: '2024-01-01' },
      profile: { id: 1, userId: 1, firstName: 'John', lastName: 'Doe' },
      token: 'mock-token'
    };
    mockAuthService.createUserWithProfile.and.returnValue(of(mockResponse));

    component.signupForm.patchValue({
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01'
    });

    component.onSubmit();

    expect(mockAuthService.createUserWithProfile).toHaveBeenCalled();
  });
});
