import { ComponentFixture, TestBed } from '@angular/core/testing';
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
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
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
    expect(component.loginForm.valid).toBeFalsy();
  });

  /**
   * Test que le service d'authentification est appelé avec les bonnes données
   * Test that auth service is called with correct data
   */
  it('should call authService.login when form is valid', () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    mockAuthService.login.and.returnValue(of(mockUser));

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
    });

    component.onSubmit();

    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  /**
   * Test de gestion de l'erreur 401 (identifiants incorrects)
   * Test handling of 401 error (incorrect credentials)
   */
  it('should handle 401 error correctly', () => {
    mockAuthService.login.and.returnValue(throwError(() => ({ status: 401 })));
    
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
    });
    
    component.onSubmit();
    
    expect(component.error).toBe('Email ou mot de passe incorrect');
  });

  /**
   * Test du basculement de la visibilité du mot de passe
   * Test password visibility toggle
   */
  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalsy();
    
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTruthy();
  });

  /**
   * Test de navigation vers la page d'inscription
   * Test navigation to signup page
   */
  it('should navigate to signup page', () => {
    component.goToSignup();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/signup']);
  });

  /**
   * Test de nettoyage des erreurs lors de la saisie
   * Test clearing errors on field change
   */
  it('should clear error on field change', () => {
    component.error = 'Test error';
    component.onFieldChange();
    
    expect(component.error).toBeNull();
  });
});
