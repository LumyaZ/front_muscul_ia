import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { RecordComponent } from './record.component';
import { User } from '../../../models/user.model';

describe('RecordComponent', () => {
  let component: RecordComponent;
  let fixture: ComponentFixture<RecordComponent>;
  let router: jasmine.SpyObj<Router>;
  let authService: jasmine.SpyObj<AuthService>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    creationDate: new Date().toISOString()
  };

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getCurrentUser', 
      'isAuthenticated'
    ]);

    await TestBed.configureTestingModule({
      imports: [RecordComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecordComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load user data on init when user is authenticated', () => {
      authService.getCurrentUser.and.returnValue(mockUser);
      authService.isAuthenticated.and.returnValue(true);
      
      component.ngOnInit();
      
      expect(authService.getCurrentUser).toHaveBeenCalled();
      expect(component.isLoading).toBe(false);
      expect(component.error).toBeNull();
    });

    it('should handle authentication error and redirect to login', (done) => {
      authService.getCurrentUser.and.returnValue(null);
      authService.isAuthenticated.and.returnValue(false);
      
      component.ngOnInit();
      
      expect(component.error).toBe('Utilisateur non connecté. Redirection vers la page de connexion.');
      
      setTimeout(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
        done();
      }, 2100);
    });

    it('should handle service errors gracefully', () => {
      authService.getCurrentUser.and.throwError('Service error');
      authService.isAuthenticated.and.returnValue(false);
      
      component.ngOnInit();
      
      expect(component.error).toBe('Erreur lors du chargement des données');
      expect(component.isLoading).toBe(false);
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      authService.getCurrentUser.and.returnValue(mockUser);
      authService.isAuthenticated.and.returnValue(true);
      component.ngOnInit();
    });

    it('should navigate to select-program when startTraining is called', () => {
      component.startTraining();
      
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/record/select-program']);
    });

    it('should navigate to program-recap when viewHistory is called', () => {
      component.viewHistory();
      
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/record/program-recap']);
    });
  });

  describe('Error Handling', () => {
    it('should clear error and reinitialize when clearError is called', () => {
      component.error = 'Test error';
      spyOn(component as any, 'initializeComponent');
      
      component.clearError();
      
      expect(component.error).toBeNull();
      expect((component as any).initializeComponent).toHaveBeenCalled();
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      authService.getCurrentUser.and.returnValue(mockUser);
      authService.isAuthenticated.and.returnValue(true);
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should display loading state when isLoading is true', () => {
      component.isLoading = true;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Chargement de vos données');
    });

    it('should display error state when error exists', () => {
      component.error = 'Test error message';
      component.isLoading = false;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Erreur');
      expect(compiled.textContent).toContain('Test error message');
      expect(compiled.textContent).toContain('Réessayer');
    });

    it('should display main content when not loading and no error', () => {
      component.isLoading = false;
      component.error = null;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Enregistrer un Entraînement');
      expect(compiled.textContent).toContain('Démarrer un Entraînement');
      expect(compiled.textContent).toContain('Historique des Entraînements');
    });
  });
}); 