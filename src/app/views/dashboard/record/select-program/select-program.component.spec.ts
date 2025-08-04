import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SelectProgramComponent } from './select-program.component';
import { UserTrainingProgramService } from '../../../../services/user-training-program.service';
import { AuthService } from '../../../../services/auth.service';
import { User } from '../../../../models/user.model';

describe('SelectProgramComponent', () => {
  let component: SelectProgramComponent;
  let fixture: ComponentFixture<SelectProgramComponent>;
  let mockUserTrainingProgramService: jasmine.SpyObj<UserTrainingProgramService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: 1,
    email: 'test@test.com',
    creationDate: new Date().toISOString()
  };

  const mockUserTrainingPrograms = [
    {
      id: 1,
      userId: 1,
      trainingProgramId: 1,
      trainingProgramName: 'Programme Débutant',
      trainingProgramDescription: 'Programme pour débutants',
      trainingProgramCategory: 'STRENGTH',
      trainingProgramDifficultyLevel: 'BEGINNER',
      trainingProgramDurationWeeks: 4,
      trainingProgramSessionsPerWeek: 3,
      trainingProgramIsPublic: true,
      currentWeek: 0,
      currentDay: 0,
      isCompleted: false,
      startDate: null,
      progressPercentage: 0,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      userId: 1,
      trainingProgramId: 2,
      trainingProgramName: 'Programme Intermédiaire',
      trainingProgramDescription: 'Programme pour intermédiaires',
      trainingProgramCategory: 'STRENGTH',
      trainingProgramDifficultyLevel: 'INTERMEDIATE',
      trainingProgramDurationWeeks: 6,
      trainingProgramSessionsPerWeek: 4,
      trainingProgramIsPublic: true,
      currentWeek: 3,
      currentDay: 2,
      isCompleted: false,
      startDate: '2024-01-01T00:00:00Z',
      progressPercentage: 50,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ] as any;

  beforeEach(async () => {
    const userTrainingProgramServiceSpy = jasmine.createSpyObj('UserTrainingProgramService', ['getUserPrograms']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'isAuthenticated']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SelectProgramComponent],
      providers: [
        { provide: UserTrainingProgramService, useValue: userTrainingProgramServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    mockUserTrainingProgramService = TestBed.inject(UserTrainingProgramService) as jasmine.SpyObj<UserTrainingProgramService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectProgramComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load user programs on init when user is authenticated', () => {
      mockAuthService.getCurrentUser.and.returnValue(mockUser);
      mockAuthService.isAuthenticated.and.returnValue(true);
      mockUserTrainingProgramService.getUserPrograms.and.returnValue(of(mockUserTrainingPrograms));
      
      component.ngOnInit();
      
      expect(mockUserTrainingProgramService.getUserPrograms).toHaveBeenCalledWith(1);
      expect(component.userPrograms).toEqual(mockUserTrainingPrograms);
      expect(component.loading).toBeFalse();
      expect(component.error).toBeNull();
    });

    it('should handle error when user not logged in', (done) => {
      mockAuthService.getCurrentUser.and.returnValue(null);
      mockAuthService.isAuthenticated.and.returnValue(false);
      
      component.ngOnInit();
      
      expect(component.error).toBe('Utilisateur non connecté. Redirection vers la page de connexion.');
      
      setTimeout(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
        done();
      }, 2100);
    });

    it('should handle service error gracefully', () => {
      mockAuthService.getCurrentUser.and.returnValue(mockUser);
      mockAuthService.isAuthenticated.and.returnValue(true);
      mockUserTrainingProgramService.getUserPrograms.and.returnValue(throwError('Service error'));
      
      component.ngOnInit();
      
      expect(component.error).toBe('Erreur lors du chargement des programmes');
      expect(component.loading).toBeFalse();
    });

    it('should handle initialization error', () => {
      mockAuthService.getCurrentUser.and.throwError('Auth error');
      
      component.ngOnInit();
      
      expect(component.error).toBe('Erreur lors de l\'initialisation');
      expect(component.loading).toBeFalse();
    });
  });

  describe('Program Selection', () => {
    beforeEach(() => {
      mockAuthService.getCurrentUser.and.returnValue(mockUser);
      mockAuthService.isAuthenticated.and.returnValue(true);
      mockUserTrainingProgramService.getUserPrograms.and.returnValue(of(mockUserTrainingPrograms));
      component.ngOnInit();
    });

    it('should select a program when clicked', () => {
      const program = mockUserTrainingPrograms[0];
      
      component.selectProgram(program);
      
      expect(component.selectedProgram).toEqual(program);
    });

    it('should check if program is selected', () => {
      const program = mockUserTrainingPrograms[0];
      component.selectedProgram = program;
      
      expect(component.isProgramSelected(program)).toBeTrue();
      expect(component.isProgramSelected(mockUserTrainingPrograms[1])).toBeFalse();
    });

    it('should check if can proceed', () => {
      expect(component.canProceed()).toBeFalse();
      
      component.selectedProgram = mockUserTrainingPrograms[0];
      expect(component.canProceed()).toBeTrue();
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      mockAuthService.getCurrentUser.and.returnValue(mockUser);
      mockAuthService.isAuthenticated.and.returnValue(true);
      mockUserTrainingProgramService.getUserPrograms.and.returnValue(of(mockUserTrainingPrograms));
      component.ngOnInit();
    });

    it('should navigate to training when next is clicked', () => {
      component.selectedProgram = mockUserTrainingPrograms[0];
      
      component.onNext();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/record/training', mockUserTrainingPrograms[0].trainingProgramId]);
    });

    it('should not navigate when no program selected', () => {
      component.onNext();
      
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should navigate back to record page', () => {
      component.onBack();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/record']);
    });
  });

  describe('Utility Methods', () => {
    beforeEach(() => {
      mockAuthService.getCurrentUser.and.returnValue(mockUser);
      mockAuthService.isAuthenticated.and.returnValue(true);
      mockUserTrainingProgramService.getUserPrograms.and.returnValue(of(mockUserTrainingPrograms));
      component.ngOnInit();
    });

    it('should group programs by category', () => {
      const categories = component.getProgramsByCategory();
      
      expect(categories['STRENGTH']).toBeDefined();
      expect(categories['STRENGTH'].length).toBe(2);
      expect(categories['STRENGTH'][0].trainingProgramCategory).toBe('STRENGTH');
      expect(categories['STRENGTH'][1].trainingProgramCategory).toBe('STRENGTH');
    });

    it('should get status label', () => {
      expect(component.getStatusLabel('NOT_STARTED')).toBe('Non commencé');
      expect(component.getStatusLabel('IN_PROGRESS')).toBe('En cours');
      expect(component.getStatusLabel('COMPLETED')).toBe('Terminé');
      expect(component.getStatusLabel('PAUSED')).toBe('En pause');
      expect(component.getStatusLabel(undefined)).toBe('Non commencé');
    });

    it('should calculate progress percentage', () => {
      const program = mockUserTrainingPrograms[1];
      
      expect(component.getProgressPercentage(program)).toBe(50);
      
      const notStartedProgram = mockUserTrainingPrograms[0];
      expect(component.getProgressPercentage(notStartedProgram)).toBe(0);
    });

    it('should clear error and reload programs', () => {
      component.error = 'Test error';
      spyOn(component, 'loadUserPrograms');
      
      component.clearError();
      
      expect(component.error).toBeNull();
      expect(component.loadUserPrograms).toHaveBeenCalled();
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      mockAuthService.getCurrentUser.and.returnValue(mockUser);
      mockAuthService.isAuthenticated.and.returnValue(true);
      mockUserTrainingProgramService.getUserPrograms.and.returnValue(of(mockUserTrainingPrograms));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should display loading state when loading', () => {
      component.loading = true;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Chargement des programmes');
    });

    it('should display error state when error exists', () => {
      component.error = 'Test error message';
      component.loading = false;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Erreur');
      expect(compiled.textContent).toContain('Test error message');
      expect(compiled.textContent).toContain('Réessayer');
    });
  });
}); 