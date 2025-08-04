import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UserProgramsComponent } from './user-programs.component';
import { UserTrainingProgramService } from '../../../../services/user-training-program.service';
import { UserTrainingProgram } from '../../../../models/user-training-program.model';
import { AuthService } from '../../../../services/auth.service';
import { of, throwError } from 'rxjs';

/**
 * Tests pour le composant UserProgramsComponent
 * Tests for UserProgramsComponent
 */
describe('UserProgramsComponent', () => {
  let component: UserProgramsComponent;
  let fixture: ComponentFixture<UserProgramsComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockUserTrainingProgramService: jasmine.SpyObj<UserTrainingProgramService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const mockUser = {
    id: 1,
    email: 'test@example.com'
  };

  const mockUserPrograms: UserTrainingProgram[] = [
    {
      id: 1,
      userId: 1,
      trainingProgramId: 1,
      trainingProgramName: 'Programme Force Débutant',
      trainingProgramDescription: 'Programme de musculation pour débutants',
      trainingProgramCategory: 'Musculation',
      trainingProgramDifficultyLevel: 'Débutant',
      trainingProgramDurationWeeks: 8,
      trainingProgramSessionsPerWeek: 3,
      trainingProgramIsPublic: true,
      currentWeek: 3,
      currentDay: 2,
      isCompleted: false,
      startDate: '2024-01-01T00:00:00Z',
      progressPercentage: 25,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      userId: 1,
      trainingProgramId: 2,
      trainingProgramName: 'Programme Cardio Avancé',
      trainingProgramDescription: 'Programme cardio intensif',
      trainingProgramCategory: 'Cardio',
      trainingProgramDifficultyLevel: 'Avancé',
      trainingProgramDurationWeeks: 12,
      trainingProgramSessionsPerWeek: 4,
      trainingProgramIsPublic: true,
      currentWeek: 12,
      currentDay: 4,
      isCompleted: true,
      startDate: '2024-01-01T00:00:00Z',
      completionDate: '2024-03-01T00:00:00Z',
      progressPercentage: 100,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ];

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const userTrainingProgramServiceSpy = jasmine.createSpyObj('UserTrainingProgramService', [
      'getUserPrograms',
      'unsubscribeUserFromProgram'
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);

    await TestBed.configureTestingModule({
      imports: [UserProgramsComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: UserTrainingProgramService, useValue: userTrainingProgramServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserProgramsComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockUserTrainingProgramService = TestBed.inject(UserTrainingProgramService) as jasmine.SpyObj<UserTrainingProgramService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  describe('Initialisation du composant', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.isLoading).toBe(false);
      expect(component.error).toBeNull();
      expect(component.userPrograms).toEqual([]);
      expect(component.currentUser).toBeNull();
    });
  });

  describe('Chargement des données utilisateur', () => {
    it('should load user data successfully', () => {
      mockAuthService.getCurrentUser.and.returnValue(mockUser);
      mockUserTrainingProgramService.getUserPrograms.and.returnValue(of(mockUserPrograms));

      component.ngOnInit();

      expect(component.currentUser).toEqual(mockUser);
      expect(component.userPrograms).toEqual(mockUserPrograms);
      expect(component.isLoading).toBeFalsy();
      expect(component.error).toBeNull();
    });

    it('should handle user not connected', () => {
      mockAuthService.getCurrentUser.and.returnValue(null);

      component.ngOnInit();

      expect(component.error).toBe('Erreur: Utilisateur non connecté');
      expect(component.currentUser).toBeNull();
    });

    it('should handle user without id', () => {
      mockAuthService.getCurrentUser.and.returnValue({ email: 'test@example.com' });

      component.ngOnInit();

      expect(component.error).toBe('Erreur: Utilisateur non connecté');
    });
  });

  describe('Chargement des programmes', () => {
    beforeEach(() => {
      component.currentUser = mockUser;
    });

    it('should load user programs successfully', () => {
      mockUserTrainingProgramService.getUserPrograms.and.returnValue(of(mockUserPrograms));

      component.loadUserPrograms();

      expect(component.userPrograms).toEqual(mockUserPrograms);
      expect(component.isLoading).toBeFalsy();
      expect(component.error).toBeNull();
    });

    it('should handle loading error', () => {
      const error = { status: 500, message: 'Server error' };
      mockUserTrainingProgramService.getUserPrograms.and.returnValue(throwError(() => error));

      component.loadUserPrograms();

      expect(component.error).toBe('Erreur lors du chargement des programmes');
      expect(component.isLoading).toBeFalsy();
    });

    it('should handle 401 error', () => {
      const error = { status: 401 };
      mockUserTrainingProgramService.getUserPrograms.and.returnValue(throwError(() => error));

      component.loadUserPrograms();

      expect(component.error).toBe('Session expirée. Veuillez vous reconnecter.');
    });

    it('should handle 403 error', () => {
      const error = { status: 403 };
      mockUserTrainingProgramService.getUserPrograms.and.returnValue(throwError(() => error));

      component.loadUserPrograms();

      expect(component.error).toBe('Accès refusé. Vous n\'avez pas les permissions nécessaires.');
    });

    it('should handle 404 error', () => {
      const error = { status: 404 };
      mockUserTrainingProgramService.getUserPrograms.and.returnValue(throwError(() => error));

      component.loadUserPrograms();

      expect(component.error).toBe('Aucun programme trouvé.');
    });

    it('should handle network error', () => {
      const error = { status: 0 };
      mockUserTrainingProgramService.getUserPrograms.and.returnValue(throwError(() => error));

      component.loadUserPrograms();

      expect(component.error).toBe('Impossible de se connecter au serveur. Vérifiez votre connexion.');
    });
  });

  describe('Méthodes de navigation', () => {
    it('should navigate to create program with provenance parameters', () => {
      component.currentUser = mockUser;
      
      component.createNewProgram();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/programs/create'], {
        queryParams: {
          from: 'you-programs',
          userId: mockUser.id
        }
      });
    });

    it('should navigate to all programs', () => {
      component.goToAllPrograms();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/programs']);
    });

    it('should navigate to program details with provenance parameters', () => {
      const programId = 1;
      component.currentUser = mockUser;
      
      component.viewProgramDetails(programId);
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/programs', programId], {
        queryParams: {
          from: 'you-programs',
          userId: mockUser.id
        }
      });
    });
  });

  describe('Gestion des programmes', () => {
    beforeEach(() => {
      component.currentUser = mockUser;
      component.userPrograms = mockUserPrograms;
    });

    it('should refresh programs', () => {
      spyOn(component, 'loadUserPrograms');
      
      component.refreshPrograms();
      
      expect(component.loadUserPrograms).toHaveBeenCalled();
    });

    it('should unsubscribe from program successfully', () => {
      const programId = 1;
      spyOn(window, 'confirm').and.returnValue(true);
      mockUserTrainingProgramService.unsubscribeUserFromProgram.and.returnValue(of(void 0));
      
      component.unsubscribeFromProgram(programId);
      
      expect(mockUserTrainingProgramService.unsubscribeUserFromProgram).toHaveBeenCalledWith(mockUser.id, programId);
      expect(component.userPrograms.length).toBe(1);
      expect(component.userPrograms[0].trainingProgramId).toBe(2);
    });

    it('should not unsubscribe if user cancels', () => {
      const programId = 1;
      spyOn(window, 'confirm').and.returnValue(false);
      
      component.unsubscribeFromProgram(programId);
      
      expect(mockUserTrainingProgramService.unsubscribeUserFromProgram).not.toHaveBeenCalled();
    });

    it('should handle unsubscribe error', () => {
      const programId = 1;
      const error = { status: 500 };
      spyOn(window, 'confirm').and.returnValue(true);
      mockUserTrainingProgramService.unsubscribeUserFromProgram.and.returnValue(throwError(() => error));
      
      component.unsubscribeFromProgram(programId);
      
      expect(component.error).toBe('Erreur lors du désabonnement');
    });

    it('should handle unsubscribe without user', () => {
      component.currentUser = null;
      const programId = 1;
      
      component.unsubscribeFromProgram(programId);
      
      expect(component.error).toBe('Erreur: Utilisateur non connecté');
    });
  });

  describe('Méthodes de statut', () => {
    it('should return correct status colors', () => {
      expect(component.getStatusColor('IN_PROGRESS')).toBe('#4CAF50');
      expect(component.getStatusColor('COMPLETED')).toBe('#2196F3');
      expect(component.getStatusColor('PAUSED')).toBe('#FF9800');
      expect(component.getStatusColor('NOT_STARTED')).toBe('#9E9E9E');
      expect(component.getStatusColor('UNKNOWN')).toBe('#9E9E9E');
    });

    it('should return correct status texts', () => {
      expect(component.getStatusText('IN_PROGRESS')).toBe('En cours');
      expect(component.getStatusText('COMPLETED')).toBe('Terminé');
      expect(component.getStatusText('PAUSED')).toBe('En pause');
      expect(component.getStatusText('NOT_STARTED')).toBe('Non commencé');
      expect(component.getStatusText('UNKNOWN')).toBe('Inconnu');
    });
  });

  describe('Méthodes utilitaires', () => {
    it('should track by program id', () => {
      const userProgram = mockUserPrograms[0];
      const result = component.trackByProgramId(0, userProgram);
      
      expect(result).toBe(userProgram.trainingProgramId);
    });
  });

  describe('Destruction du composant', () => {
    it('should complete destroy subject on destroy', () => {
      const destroySpy = spyOn(component['destroy$'], 'next');
      const completeSpy = spyOn(component['destroy$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
}); 