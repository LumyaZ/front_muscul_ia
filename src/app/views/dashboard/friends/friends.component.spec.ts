import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FriendsComponent } from './friends.component';
import { AuthService } from '../../../services/auth.service';

describe('FriendsComponent', () => {
  let component: FriendsComponent;
  let fixture: ComponentFixture<FriendsComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'isAuthenticated']);

    await TestBed.configureTestingModule({
      imports: [FriendsComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FriendsComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component successfully', () => {
    const mockUser = { id: 1, email: 'test@example.com', creationDate: '2024-01-01' };
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockAuthService.isAuthenticated.and.returnValue(true);

    component.ngOnInit();

    expect(mockAuthService.getCurrentUser).toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
    expect(component.error).toBeNull();
  });

  it('should handle authentication error and redirect to login', () => {
    mockAuthService.getCurrentUser.and.returnValue(null);
    mockAuthService.isAuthenticated.and.returnValue(false);

    component.ngOnInit();

    expect(component.error).toBe('Utilisateur non connecté. Redirection vers la page de connexion.');
  });

  it('should clear error', () => {
    const mockUser = { id: 1, email: 'test@example.com', creationDate: '2024-01-01' };
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockAuthService.isAuthenticated.and.returnValue(true);
    component.ngOnInit();
    
    component.error = 'Test error';

    component.clearError();

    expect(component.error).toBeNull();
  });

  it('should clean up subscriptions on destroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
}); 