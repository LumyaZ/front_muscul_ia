import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RecordComponent } from './record.component';
import { AuthService } from '../../../services/auth.service';

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

  it('should clear error', () => {
    // Initialize component first
    const mockUser = { id: 1, email: 'test@example.com', creationDate: '2024-01-01' };
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockAuthService.isAuthenticated.and.returnValue(true);
    component.ngOnInit();
    
    // Set error manually
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