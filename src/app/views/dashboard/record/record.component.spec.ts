import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RecordComponent } from './record.component';
import { AuthService } from '../../../services/auth.service';

/**
 * Unit tests for RecordComponent.
 * Tests unitaires pour RecordComponent.
 */
describe('RecordComponent', () => {
  let component: RecordComponent;
  let fixture: ComponentFixture<RecordComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'isAuthenticated']);

    await TestBed.configureTestingModule({
      imports: [RecordComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecordComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isLoading).toBe(false);
    expect(component.error).toBeNull();
  });

  it('should initialize component successfully when user is authenticated', () => {
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
    spyOn(window, 'setTimeout').and.callFake((callback: any) => callback());

    component.ngOnInit();

    expect(component.error).toBe('Utilisateur non connecté. Redirection vers la page de connexion.');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle initialization error', () => {
    mockAuthService.getCurrentUser.and.throwError('Auth error');

    component.ngOnInit();

    expect(component.error).toBe('Erreur lors du chargement des données');
    expect(component.isLoading).toBe(false);
  });

  it('should navigate to select-program when startTraining is called', () => {
    component.startTraining();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/record/select-program']);
  });

  it('should not navigate when loading', () => {
    component.isLoading = true;

    component.startTraining();

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should handle navigation error', () => {
    spyOn(console, 'error');
    mockRouter.navigate.and.throwError('Navigation error');

    component.startTraining();

    expect(component.error).toBe('Erreur lors de la navigation');
    expect(console.error).toHaveBeenCalled();
  });

  it('should clear error and reinitialize component', () => {
    const mockUser = { id: 1, email: 'test@example.com', creationDate: '2024-01-01' };
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