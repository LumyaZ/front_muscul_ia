import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UserTrainingsComponent } from './user-trainings.component';
import { TrainingSessionService, TrainingSessionDto } from '../../../../services/training-session.service';
import { AuthService } from '../../../../services/auth.service';
import { of, throwError } from 'rxjs';

describe('UserTrainingsComponent', () => {
  let component: UserTrainingsComponent;
  let fixture: ComponentFixture<UserTrainingsComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockTrainingSessionService: jasmine.SpyObj<TrainingSessionService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const mockUser = {
    id: 1,
    email: 'test@example.com'
  };

  const mockTrainingSessions: TrainingSessionDto[] = [
    {
      id: 1,
      userId: 1,
      name: 'Entraînement Force',
      sessionDate: '2024-01-15T10:00:00Z',
      durationMinutes: 90,
      sessionType: 'Force',
      description: 'Entraînement de force complet',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      userId: 1,
      name: 'Cardio HIIT',
      sessionDate: '2024-01-14T08:00:00Z',
      durationMinutes: 45,
      sessionType: 'Cardio',
      description: 'Entraînement cardio intensif',
      createdAt: '2024-01-14T08:00:00Z',
      updatedAt: '2024-01-14T08:00:00Z'
    }
  ];

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const trainingSessionServiceSpy = jasmine.createSpyObj('TrainingSessionService', [
      'getUserTrainingSessions',
      'deleteTrainingSession'
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);

    await TestBed.configureTestingModule({
      imports: [UserTrainingsComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: TrainingSessionService, useValue: trainingSessionServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserTrainingsComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockTrainingSessionService = TestBed.inject(TrainingSessionService) as jasmine.SpyObj<TrainingSessionService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.trainingSessions).toEqual([]);
      expect(component.isLoading).toBeFalsy();
      expect(component.error).toBeNull();
      expect(component.currentUser).toBeNull();
    });
  });

  describe('User Data Loading', () => {
    it('should load user data successfully', () => {
      mockAuthService.getCurrentUser.and.returnValue(mockUser);
      mockTrainingSessionService.getUserTrainingSessions.and.returnValue(of(mockTrainingSessions));

      component.ngOnInit();

      expect(component.currentUser).toEqual(mockUser);
      expect(component.trainingSessions).toEqual(mockTrainingSessions);
      expect(component.isLoading).toBeFalsy();
      expect(component.error).toBeNull();
    });

    it('should handle user not connected', () => {
      mockAuthService.getCurrentUser.and.returnValue(null);

      component.ngOnInit();

      expect(component.error).toBe('Utilisateur non connecté');
      expect(component.currentUser).toBeNull();
    });
  });

  describe('Training Sessions Loading', () => {
    beforeEach(() => {
      component.currentUser = mockUser;
    });

    it('should load training sessions successfully', () => {
      mockTrainingSessionService.getUserTrainingSessions.and.returnValue(of(mockTrainingSessions));

      component.loadTrainingSessions();

      expect(component.trainingSessions).toEqual(mockTrainingSessions);
      expect(component.isLoading).toBeFalsy();
      expect(component.error).toBeNull();
    });

    it('should handle loading error', () => {
      const error = { status: 500, message: 'Server error' };
      mockTrainingSessionService.getUserTrainingSessions.and.returnValue(throwError(() => error));

      component.loadTrainingSessions();

      expect(component.error).toBe('Erreur lors du chargement des sessions d\'entraînement');
      expect(component.isLoading).toBeFalsy();
    });

    it('should handle 401 error', () => {
      const error = { status: 401 };
      mockTrainingSessionService.getUserTrainingSessions.and.returnValue(throwError(() => error));

      component.loadTrainingSessions();

      expect(component.error).toBe('Session expirée. Veuillez vous reconnecter.');
    });

    it('should handle 403 error', () => {
      const error = { status: 403 };
      mockTrainingSessionService.getUserTrainingSessions.and.returnValue(throwError(() => error));

      component.loadTrainingSessions();

      expect(component.error).toBe('Accès refusé. Vous n\'avez pas les permissions nécessaires.');
    });

    it('should handle 404 error', () => {
      const error = { status: 404 };
      mockTrainingSessionService.getUserTrainingSessions.and.returnValue(throwError(() => error));

      component.loadTrainingSessions();

      expect(component.error).toBe('Aucune session d\'entraînement trouvée.');
    });

    it('should handle network error', () => {
      const error = { status: 0 };
      mockTrainingSessionService.getUserTrainingSessions.and.returnValue(throwError(() => error));

      component.loadTrainingSessions();

      expect(component.error).toBe('Impossible de se connecter au serveur. Vérifiez votre connexion.');
    });
  });

  describe('Utility Methods', () => {
    it('should format date correctly', () => {
      const dateString = '2024-01-15T10:00:00Z';
      const formattedDate = component.formatDate(dateString);
      
      expect(formattedDate).toMatch(/\d{1,2}\s+\w+\s+\d{4}/);
    });

    it('should format duration correctly', () => {
      expect(component.formatDuration(90)).toBe('1h 30min');
      expect(component.formatDuration(45)).toBe('45min');
      expect(component.formatDuration(60)).toBe('1h');
    });

    it('should track by session id', () => {
      const session = mockTrainingSessions[0];
      const result = component.trackBySessionId(0, session);
      
      expect(result).toBe(session.id);
    });
  });

  describe('User Actions', () => {
    beforeEach(() => {
      component.currentUser = mockUser;
      component.trainingSessions = mockTrainingSessions;
    });

    it('should refresh trainings', () => {
      spyOn(component, 'loadTrainingSessions');
      
      component.refreshTrainings();
      
      expect(component.loadTrainingSessions).toHaveBeenCalled();
    });

    it('should navigate to training session details', () => {
      const sessionId = 1;
      
      component.viewTrainingSession(sessionId);
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/trainings', sessionId]);
    });

    it('should delete training session successfully', () => {
      const sessionId = 1;
      spyOn(window, 'confirm').and.returnValue(true);
      mockTrainingSessionService.deleteTrainingSession.and.returnValue(of(void 0));
      spyOn(component, 'loadTrainingSessions');
      
      component.deleteTrainingSession(sessionId);
      
      expect(mockTrainingSessionService.deleteTrainingSession).toHaveBeenCalledWith(sessionId);
      expect(component.loadTrainingSessions).toHaveBeenCalled();
    });

    it('should not delete training session if user cancels', () => {
      const sessionId = 1;
      spyOn(window, 'confirm').and.returnValue(false);
      
      component.deleteTrainingSession(sessionId);
      
      expect(mockTrainingSessionService.deleteTrainingSession).not.toHaveBeenCalled();
    });

    it('should handle delete error', () => {
      const sessionId = 1;
      const error = { status: 500 };
      spyOn(window, 'confirm').and.returnValue(true);
      mockTrainingSessionService.deleteTrainingSession.and.returnValue(throwError(() => error));
      
      component.deleteTrainingSession(sessionId);
      
      expect(component.error).toBe('Erreur lors de la suppression de la session');
    });
  });

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