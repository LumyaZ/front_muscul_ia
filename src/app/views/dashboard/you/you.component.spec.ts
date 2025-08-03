import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, Input } from '@angular/core';
import { YouComponent } from './you.component';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../models/user.model';

// Mock components
@Component({
  selector: 'app-user-trainings',
  template: '<div>Mock User Trainings</div>',
  standalone: true
})
class MockUserTrainingsComponent {}

@Component({
  selector: 'app-user-programs',
  template: '<div>Mock User Programs</div>',
  standalone: true
})
class MockUserProgramsComponent {}

@Component({
  selector: 'app-header',
  template: '<div>Mock Header</div>',
  standalone: true
})
class MockHeaderComponent {}

@Component({
  selector: 'app-nav-bar',
  template: '<div>Mock Nav Bar</div>',
  standalone: true
})
class MockNavBarComponent {
  @Input() currentRoute: string = '';
}

/**
 * Unit tests for YouComponent.
 * Tests unitaires pour YouComponent.
 */
describe('YouComponent', () => {
  let component: YouComponent;
  let fixture: ComponentFixture<YouComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    creationDate: '2023-01-01T00:00:00Z'
  };

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        YouComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        MockUserTrainingsComponent,
        MockUserProgramsComponent,
        MockHeaderComponent,
        MockNavBarComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(YouComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  /**
   * Test de création du composant
   * Test component creation
   */
  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.selectedTab).toBe('trainings');
      expect(component.isLoading).toBeFalsy();
      expect(component.error).toBeNull();
      expect(component.user).toBeNull();
      expect(component.joinDate).toBeInstanceOf(Date);
    });
  });

  /**
   * Test de chargement des données utilisateur
   * Test user data loading
   */
  describe('User Data Loading', () => {
    it('should load user data successfully', () => {
      mockAuthService.getCurrentUser.and.returnValue(mockUser);
      
      component.ngOnInit();
      
      expect(component.user).toEqual(mockUser);
      expect(component.isLoading).toBeFalsy();
      expect(component.error).toBeNull();
    });

    it('should handle user not connected', () => {
      mockAuthService.getCurrentUser.and.returnValue(null);
      
      component.ngOnInit();
      
      expect(component.user).toBeNull();
      expect(component.error).toBe('Utilisateur non connecté. Redirection vers la page de connexion.');
    });
  });

  /**
   * Test de changement d'onglet
   * Test tab switching
   */
  describe('Tab Switching', () => {
    beforeEach(() => {
      component.user = mockUser;
    });

    it('should switch to programs tab', () => {
      component.selectTab('programs');
      
      expect(component.selectedTab).toBe('programs');
      expect(component.error).toBeNull();
    });

    it('should switch to trainings tab', () => {
      component.selectedTab = 'programs';
      component.selectTab('trainings');
      
      expect(component.selectedTab).toBe('trainings');
      expect(component.error).toBeNull();
    });
  });

  /**
   * Test des méthodes utilitaires
   * Test utility methods
   */
  describe('Utility Methods', () => {
    it('should clear error', () => {
      component.error = 'Test error';
      component.clearError();
      
      expect(component.error).toBeNull();
    });
  });

  /**
   * Test de destruction du composant
   * Test component destruction
   */
  describe('Component Destruction', () => {
    it('should complete destroy subject on destroy', () => {
      const destroySpy = spyOn(component['destroy$'], 'next');
      const completeSpy = spyOn(component['destroy$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
}); 