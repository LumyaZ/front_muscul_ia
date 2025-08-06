import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    creationDate: '2024-01-01T00:00:00'
  };

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getCurrentUser',
      'isAuthenticated',
      'logout'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    authServiceSpy.getCurrentUser.and.returnValue(mockUser);
    authServiceSpy.isAuthenticated.and.returnValue(true);
    authServiceSpy.logout.and.returnValue(undefined);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'dashboard/home', component: {} as any },
          { path: 'login', component: {} as any },
          { path: 'profile', component: {} as any },
          { path: '', component: {} as any }
        ]),
        HttpClientTestingModule,
        HeaderComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  /**
   * Test component creation
   * Test de création du composant
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test component initialization
   * Test d'initialisation du composant
   */
  it('should initialize component correctly', () => {
    expect(mockAuthService.getCurrentUser).toHaveBeenCalled();
    expect(component.currentUser).toEqual(mockUser);
    expect(component.isLoading).toBeFalse();
    expect(component.error).toBeNull();
  });

  /**
   * Test error handling when loading user data
   * Test de gestion d'erreur lors du chargement des données
   */
  it('should handle error when loading user data', () => {
    mockAuthService.getCurrentUser.and.throwError('Erreur de chargement');
    
    component.ngOnInit();
    
    expect(component.error).toBe('Erreur lors du chargement des données utilisateur');
    expect(component.currentUser).toBeNull();
    expect(component.isLoading).toBeFalse();
  });

  /**
   * Test authentication check
   * Test de vérification d'authentification
   */
  it('should check authentication correctly', () => {
    mockAuthService.isAuthenticated.and.returnValue(true);
    expect(component.isAuthenticated()).toBeTrue();
    
    mockAuthService.isAuthenticated.and.returnValue(false);
    expect(component.isAuthenticated()).toBeFalse();
  });

  /**
   * Test profile navigation for different user states
   * Test de navigation profil pour différents états utilisateur
   */
  it('should navigate correctly based on authentication state', () => {
      
    mockAuthService.isAuthenticated.and.returnValue(true);
    component.onProfileClick();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile']);
    expect(component.showUserMenu).toBeFalse();

    
    mockAuthService.isAuthenticated.and.returnValue(false);
    component.onProfileClick();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    expect(component.showUserMenu).toBeFalse();
  });

  /**
   * Test login page navigation
   * Test de navigation vers la page de connexion
   */
  it('should navigate to login page', () => {
    component.onLogin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  /**
   * Test successful logout
   * Test de déconnexion réussie
   */
  it('should logout successfully', () => {
    component.currentUser = mockUser;
    component.showUserMenu = true;
    
    component.onLogout();
    
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(component.currentUser).toBeNull();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    expect(component.showUserMenu).toBeFalse();
  });

  /**
   * Test logo navigation for different user states
   * Test de navigation logo pour différents états utilisateur
   */
  it('should navigate logo correctly based on authentication state', () => {
    
    mockAuthService.isAuthenticated.and.returnValue(true);
    component.onLogoClick();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/home']);

    
    mockAuthService.isAuthenticated.and.returnValue(false);
    component.onLogoClick();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  /**
   * Test user menu toggle functionality
   * Test de fonctionnalité de basculement du menu utilisateur
   */
  it('should toggle user menu correctly', () => {
    expect(component.showUserMenu).toBeFalse();
    
    component.toggleUserMenu();
    expect(component.showUserMenu).toBeTrue();
    
    component.toggleUserMenu();
    expect(component.showUserMenu).toBeFalse();
  });

  /**
   * Test close user menu functionality
   * Test de fermeture du menu utilisateur
   */
  it('should close user menu correctly', () => {
    component.showUserMenu = true;
    component.closeUserMenu();
    expect(component.showUserMenu).toBeFalse();
  });

  /**
   * Test user display name functionality
   * Test de fonctionnalité du nom d'affichage utilisateur
   */
  it('should get user display name correctly', () => {
    
    component.currentUser = mockUser;
    expect(component.getUserDisplayName()).toBe('test@example.com');

    
    component.currentUser = null;
    expect(component.getUserDisplayName()).toBe('Utilisateur');
  });

  /**
   * Test user initials functionality
   * Test de fonctionnalité des initiales utilisateur
   */
  it('should get user initials correctly', () => {
    
    component.currentUser = mockUser;
    expect(component.getUserInitials()).toBe('TE');

    
    component.currentUser = { ...mockUser, email: 'john.doe@example.com' };
    expect(component.getUserInitials()).toBe('JD');

    
    component.currentUser = null;
    expect(component.getUserInitials()).toBe('');
  });

  /**
   * Test clear error functionality
   * Test de fonctionnalité d'effacement d'erreur
   */
  it('should clear error correctly', () => {
    component.error = 'Test error';
    component.clearError();
    expect(component.error).toBeNull();
  });
}); 