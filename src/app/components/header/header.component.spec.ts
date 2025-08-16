import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
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

    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        RouterTestingModule
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.currentUser).toBeNull();
      expect(component.isLoading).toBe(false);
      expect(component.error).toBeNull();
      expect(component.showUserMenu).toBe(false);
    });

    it('should load current user on init', () => {
      mockAuthService.getCurrentUser.and.returnValue(mockUser);
      
      component.ngOnInit();
      
      expect(mockAuthService.getCurrentUser).toHaveBeenCalled();
      expect(component.currentUser).toEqual(mockUser);
      expect(component.isLoading).toBe(false);
    });

    it('should handle error when loading user data', () => {
      mockAuthService.getCurrentUser.and.throwError('Erreur de chargement');
      
      component.ngOnInit();
      
      expect(component.error).toBe('Erreur lors du chargement des données utilisateur');
      expect(component.currentUser).toBeNull();
      expect(component.isLoading).toBe(false);
    });
  });

  describe('Authentication Handling', () => {
    it('should check authentication correctly', () => {
      mockAuthService.isAuthenticated.and.returnValue(true);
      expect(component.isAuthenticated()).toBe(true);
      
      mockAuthService.isAuthenticated.and.returnValue(false);
      expect(component.isAuthenticated()).toBe(false);
    });

    it('should handle null user when not authenticated', () => {
      mockAuthService.getCurrentUser.and.returnValue(null);
      
      component.ngOnInit();
      
      expect(component.currentUser).toBeNull();
      expect(component.isLoading).toBe(false);
    });
  });

  describe('Navigation', () => {
    it('should navigate to profile when authenticated', () => {
      mockAuthService.isAuthenticated.and.returnValue(true);
      
      component.onProfileClick();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile']);
      expect(component.showUserMenu).toBe(false);
    });

    it('should navigate to login when not authenticated', () => {
      mockAuthService.isAuthenticated.and.returnValue(false);
      
      component.onProfileClick();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
      expect(component.showUserMenu).toBe(false);
    });

    it('should navigate to login page', () => {
      component.onLogin();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should navigate to dashboard when authenticated on logo click', () => {
      mockAuthService.isAuthenticated.and.returnValue(true);
      
      component.onLogoClick();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/home']);
    });

    it('should navigate to home when not authenticated on logo click', () => {
      mockAuthService.isAuthenticated.and.returnValue(false);
      
      component.onLogoClick();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('Logout Handling', () => {
    it('should logout successfully', () => {
      component.currentUser = mockUser;
      component.showUserMenu = true;
      mockAuthService.logout.and.returnValue(undefined);
      
      component.onLogout();
      
      expect(mockAuthService.logout).toHaveBeenCalled();
      expect(component.currentUser).toBeNull();
      expect(component.showUserMenu).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should handle logout error', () => {
      mockAuthService.logout.and.throwError('Logout error');
      
      component.onLogout();
      
      expect(component.error).toBe('Erreur lors de la déconnexion');
      expect(component.isLoading).toBe(false);
    });
  });

  describe('User Menu Management', () => {
    it('should toggle user menu correctly', () => {
      expect(component.showUserMenu).toBe(false);
      
      component.toggleUserMenu();
      expect(component.showUserMenu).toBe(true);
      
      component.toggleUserMenu();
      expect(component.showUserMenu).toBe(false);
    });

    it('should close user menu correctly', () => {
      component.showUserMenu = true;
      
      component.closeUserMenu();
      
      expect(component.showUserMenu).toBe(false);
    });
  });

  describe('User Display Functions', () => {
    it('should get user display name correctly', () => {
      component.currentUser = mockUser;
      expect(component.getUserDisplayName()).toBe('test@example.com');
      
      component.currentUser = null;
      expect(component.getUserDisplayName()).toBe('Utilisateur');
    });

    it('should get user initials correctly', () => {
      component.currentUser = mockUser;
      expect(component.getUserInitials()).toBe('TE');
      
      component.currentUser = { ...mockUser, email: 'john.doe@example.com' };
      expect(component.getUserInitials()).toBe('JD');
      
      component.currentUser = { ...mockUser, email: 'user@example.com' };
      expect(component.getUserInitials()).toBe('U');
      
      component.currentUser = null;
      expect(component.getUserInitials()).toBe('');
    });
  });

  describe('Error Handling', () => {
    it('should clear error correctly', () => {
      component.error = 'Test error';
      
      component.clearError();
      
      expect(component.error).toBeNull();
    });
  });

  describe('Loading States', () => {
    it('should show loading state during logout', () => {
      component.onLogout();
      
      expect(component.isLoading).toBe(true);
    });

    it('should handle loading state during user data loading', () => {
      mockAuthService.getCurrentUser.and.returnValue(mockUser);
      
      component.ngOnInit();
      
      expect(component.isLoading).toBe(false);
    });
  });

  describe('Service Integration', () => {
    it('should inject required services', () => {
      expect(mockAuthService).toBeDefined();
      expect(mockRouter).toBeDefined();
    });

    it('should use AuthService for user authentication', () => {
      component.ngOnInit();
      
      expect(mockAuthService.getCurrentUser).toHaveBeenCalled();
    });

    it('should use AuthService for logout', () => {
      component.onLogout();
      
      expect(mockAuthService.logout).toHaveBeenCalled();
    });
  });
});