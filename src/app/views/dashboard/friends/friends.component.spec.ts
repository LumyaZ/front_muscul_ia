import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FriendsComponent } from './friends.component';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

/**
 * Unit tests for FriendsComponent.
 * Tests unitaires pour FriendsComponent.
 */
describe('FriendsComponent', () => {
  let component: FriendsComponent;
  let fixture: ComponentFixture<FriendsComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        FriendsComponent,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FriendsComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isLoading).toBe(false);
    expect(component.error).toBeNull();
  });

  it('should load successfully when user is authenticated', () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    
    component.ngOnInit();
    
    expect(component.isLoading).toBe(false);
    expect(component.error).toBeNull();
  });

  it('should redirect to login when user is not authenticated', () => {
    mockAuthService.getCurrentUser.and.returnValue(null);
    spyOn(window, 'setTimeout').and.callFake((callback: any) => callback());
    
    component.ngOnInit();
    
    expect(component.error).toBe('Utilisateur non connecté. Redirection vers la page de connexion.');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle authentication error', () => {
    mockAuthService.getCurrentUser.and.throwError('Auth error');
    
    component.ngOnInit();
    
    expect(component.error).toBe('Erreur lors du chargement des données');
    expect(component.isLoading).toBe(false);
  });

  it('should clear error and reinitialize component', () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    component.error = 'Test error';
    
    component.clearError();
    
    expect(component.error).toBeNull();
  });

  it('should complete destroy subject on ngOnDestroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');
    
    component.ngOnDestroy();
    
    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});