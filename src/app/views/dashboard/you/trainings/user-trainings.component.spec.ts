import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UserTrainingsComponent } from './user-trainings.component';
import { TrainingSessionService } from '../../../../services/training-session.service';
import { TrainingSession } from '../../../../models/training-session.model';
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

  const mockTrainingSessions: TrainingSession[] = [
    {
      id: 1,
      name: 'Entraînement Force',
      description: 'Entraînement de force complet',
      sessionDate: '2024-01-15T10:00:00Z',
      sessionType: 'Force',
      durationMinutes: 90,
      userId: 1,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      notes: 'Très bon entraînement',
      trainingProgramName: 'Programme Force',
      exercises: [
        { id: 1, exerciseName: 'Squat', setsCount: 3, repsCount: 10 },
        { id: 2, exerciseName: 'Deadlift', setsCount: 3, repsCount: 8 }
      ]
    },
    {
      id: 2,
      name: 'Cardio HIIT',
      description: 'Entraînement cardio intensif',
      sessionDate: '2024-01-14T08:00:00Z',
      sessionType: 'Cardio',
      durationMinutes: 45,
      userId: 1,
      createdAt: '2024-01-14T08:00:00Z',
      updatedAt: '2024-01-14T08:00:00Z',
      exercises: [
        { id: 3, exerciseName: 'Burpees', setsCount: 5, repsCount: 15 }
      ]
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
      
      expect(result).toBe(session.id!);
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
  });

  describe('Display Information', () => {
    beforeEach(() => {
      mockAuthService.getCurrentUser.and.returnValue(mockUser);
      mockTrainingSessionService.getUserTrainingSessions.and.returnValue(of(mockTrainingSessions));
      
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should display training session information correctly', () => {
      const compiled = fixture.nativeElement;
      
      expect(compiled.textContent).toContain('Entraînement Force');
      expect(compiled.textContent).toContain('Cardio HIIT');
      expect(compiled.textContent).toContain('Force');
      expect(compiled.textContent).toContain('Cardio');
      expect(compiled.textContent).toContain('1h 30min');
      expect(compiled.textContent).toContain('45min');
    });

    it('should display exercises count when available', () => {
      const compiled = fixture.nativeElement;
      
      expect(compiled.textContent).toContain('2 exercice(s) effectué(s)');
      expect(compiled.textContent).toContain('1 exercice(s) effectué(s)');
    });

    it('should display notes when available', () => {
      const compiled = fixture.nativeElement;
      
      expect(compiled.textContent).toContain('Notes: Très bon entraînement');
    });

    it('should display training program name when available', () => {
      const compiled = fixture.nativeElement;
      
      expect(compiled.textContent).toContain('Programme: Programme Force');
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