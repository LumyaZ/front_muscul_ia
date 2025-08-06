import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TrainingComponent } from './training.component';
import { TrainingProgramService } from '../../../../services/training-program.service';
import { ProgramExerciseService } from '../../../../services/program-exercise.service';
import { TrainingSessionService } from '../../../../services/training-session.service';
import { AuthService } from '../../../../services/auth.service';

describe('TrainingComponent', () => {
  let component: TrainingComponent;
  let fixture: ComponentFixture<TrainingComponent>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockTrainingProgramService: jasmine.SpyObj<TrainingProgramService>;
  let mockProgramExerciseService: jasmine.SpyObj<ProgramExerciseService>;
  let mockTrainingSessionService: jasmine.SpyObj<TrainingSessionService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    creationDate: '2024-01-01'
  };

  const mockExercises = [
    {
      id: 1,
      trainingSessionId: 1,
      exerciseId: 1,
      exerciseName: 'Développé couché',
      exerciseDescription: 'Exercice de base',
      exerciseMuscleGroup: 'CHEST',
      setsCount: 3,
      repsCount: 10,
      durationSeconds: 60,
      weightKg: 50,
      notes: 'Exercice de base',
      isCompleted: false,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z'
    },
    {
      id: 2,
      trainingSessionId: 1,
      exerciseId: 2,
      exerciseName: 'Écarté couché',
      exerciseDescription: 'Exercice d\'isolation',
      exerciseMuscleGroup: 'CHEST',
      setsCount: 4,
      repsCount: 12,
      durationSeconds: 45,
      weightKg: 20,
      notes: 'Isolation pectoraux',
      isCompleted: false,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z'
    }
  ];

  beforeEach(async () => {
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1')
        }
      }
    });

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const trainingProgramServiceSpy = jasmine.createSpyObj('TrainingProgramService', ['getProgramById']);
    const programExerciseServiceSpy = jasmine.createSpyObj('ProgramExerciseService', ['getExercisesByProgramId']);
    const trainingSessionServiceSpy = jasmine.createSpyObj('TrainingSessionService', ['createTrainingSession']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'isAuthenticated', 'getToken']);

    await TestBed.configureTestingModule({
      imports: [TrainingComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: Router, useValue: routerSpy },
        { provide: TrainingProgramService, useValue: trainingProgramServiceSpy },
        { provide: ProgramExerciseService, useValue: programExerciseServiceSpy },
        { provide: TrainingSessionService, useValue: trainingSessionServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingComponent);
    component = fixture.componentInstance;
    mockActivatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockTrainingProgramService = TestBed.inject(TrainingProgramService) as jasmine.SpyObj<TrainingProgramService>;
    mockProgramExerciseService = TestBed.inject(ProgramExerciseService) as jasmine.SpyObj<ProgramExerciseService>;
    mockTrainingSessionService = TestBed.inject(TrainingSessionService) as jasmine.SpyObj<TrainingSessionService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component successfully', () => {
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.getToken.and.returnValue('mock-token');
    mockProgramExerciseService.getExercisesByProgramId.and.returnValue(of(mockExercises as any));

    component.ngOnInit();

    expect(mockAuthService.getCurrentUser).toHaveBeenCalled();
    expect(mockProgramExerciseService.getExercisesByProgramId).toHaveBeenCalledWith(1);
    expect(component.exercises.length).toBe(2);
    expect(component.exercises[0].completedSets).toEqual([false, false, false]);
    expect(component.exercises[1].completedSets).toEqual([false, false, false, false]);
  });

  it('should handle authentication error', () => {
    mockAuthService.getCurrentUser.and.returnValue(null);
    mockAuthService.isAuthenticated.and.returnValue(false);

    component.ngOnInit();

    expect(component.error).toBe('Utilisateur non connecté. Redirection vers la page de connexion.');
  });

  it('should handle invalid program ID', () => {
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockAuthService.isAuthenticated.and.returnValue(true);
    (mockActivatedRoute.snapshot.paramMap.get as jasmine.Spy).and.returnValue(null);

    component.ngOnInit();

    expect(component.error).toBe('ID de programme invalide');
  });

  it('should handle error when loading exercises', () => {
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockProgramExerciseService.getExercisesByProgramId.and.returnValue(throwError(() => new Error('Test error')));

    component.ngOnInit();

    expect(component.error).toBe('Erreur lors du chargement des exercices');
    expect(component.loading).toBe(false);
  });

  it('should format time correctly', () => {
    expect(component.formatTime(3661)).toBe('01:01:01');
    expect(component.formatTime(0)).toBe('00:00:00');
    expect(component.formatTime(3600)).toBe('01:00:00');
  });

  it('should toggle set completion', () => {
    component.exercises = mockExercises.map(exercise => ({
      ...exercise,
      completedSets: new Array(exercise.setsCount).fill(false)
    }));

    component.toggleSet(0, 1);
    expect(component.exercises[0].completedSets[1]).toBe(true);

    component.toggleSet(0, 1);
    expect(component.exercises[0].completedSets[1]).toBe(false);
  });

  it('should check if set is completed', () => {
    component.exercises = mockExercises.map(exercise => ({
      ...exercise,
      completedSets: new Array(exercise.setsCount).fill(false)
    }));

    expect(component.isSetCompleted(0, 0)).toBe(false);

    component.exercises[0].completedSets[0] = true;
    expect(component.isSetCompleted(0, 0)).toBe(true);
  });

  it('should get completed sets count', () => {
    component.exercises = mockExercises.map(exercise => ({
      ...exercise,
      completedSets: new Array(exercise.setsCount).fill(false)
    }));

    expect(component.getCompletedSetsCount(0)).toBe(0);

    component.exercises[0].completedSets[0] = true;
    component.exercises[0].completedSets[2] = true;
    expect(component.getCompletedSetsCount(0)).toBe(2);
  });

  it('should get total sets count', () => {
    component.exercises = mockExercises.map(exercise => ({
      ...exercise,
      completedSets: new Array(exercise.setsCount).fill(false)
    }));

    expect(component.getTotalSetsCount(0)).toBe(3);
    expect(component.getTotalSetsCount(1)).toBe(4);
  });

  it('should check if exercise is complete', () => {
    component.exercises = mockExercises.map(exercise => ({
      ...exercise,
      completedSets: new Array(exercise.setsCount).fill(false)
    }));

    expect(component.isExerciseComplete(0)).toBe(false);

    component.exercises[0].completedSets = [true, true, true];
    expect(component.isExerciseComplete(0)).toBe(true);
  });

  it('should calculate overall progress', () => {
    component.exercises = mockExercises.map(exercise => ({
      ...exercise,
      completedSets: new Array(exercise.setsCount).fill(false)
    }));

    expect(component.getOverallProgress()).toBe(0);

    component.exercises[0].completedSets = [true, true, true];
    component.exercises[1].completedSets = [true, true, false, false];

    expect(component.getOverallProgress()).toBe(71);
  });

  it('should check if training is finished', () => {
    component.exercises = mockExercises.map(exercise => ({
      ...exercise,
      completedSets: new Array(exercise.setsCount).fill(false)
    }));

    expect(component.isTrainingFinished()).toBe(false);

    component.exercises[0].completedSets = [true, true, true];
    component.exercises[1].completedSets = [true, true, true, true];
    expect(component.isTrainingFinished()).toBe(true);
  });

  it('should pause and resume timer', () => {
    component.startTimer();
    expect(component.isPaused).toBe(false);

    component.pauseTimer();
    expect(component.isPaused).toBe(true);

    component.resumeTimer();
    expect(component.isPaused).toBe(false);
  });

  it('should finish training successfully with session', () => {
    component.session = {
      id: 1,
      userId: 1,
      trainingProgramId: 1,
      name: 'Test Session',
      description: 'Test session description',
      sessionDate: new Date().toISOString(),
      sessionType: 'Strength',
      durationMinutes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isCompleted: false,
      exercises: []
    };
    component.currentUser = mockUser;
    mockAuthService.getToken.and.returnValue('mock-token');
    mockTrainingSessionService.createTrainingSession.and.returnValue(of({ id: 1 } as any));

    spyOn(component as any, 'saveTrainingSession');
    component.finishTraining();

    expect(component.isTrainingComplete).toBe(true);
    expect(component.session?.endTime).toBeDefined();
    expect((component as any).saveTrainingSession).toHaveBeenCalled();
  });

  it('should finish training successfully without session', () => {
    component.session = null;
    component.programId = 1;
    component.currentUser = mockUser;
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.getToken.and.returnValue('mock-token');
    mockTrainingSessionService.createTrainingSession.and.returnValue(of({ id: 1 } as any));

    spyOn(component as any, 'createNewSession');
    component.finishTraining();

    expect((component as any).createNewSession).toHaveBeenCalled();
  });

  it('should handle token expiration during finish training', () => {
    component.session = null;
    component.programId = 1;
    component.currentUser = mockUser;
    mockAuthService.isAuthenticated.and.returnValue(false);

    spyOn(component as any, 'handleTokenExpiration');
    component.finishTraining();

    expect((component as any).handleTokenExpiration).toHaveBeenCalled();
  });

  it('should handle 403 error when creating session', () => {
    component.session = null;
    component.programId = 1;
    component.currentUser = mockUser;
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.getToken.and.returnValue('mock-token');
    
    const error403 = { status: 403, error: 'Forbidden' };
    mockTrainingSessionService.createTrainingSession.and.returnValue(throwError(() => error403));

    spyOn(component as any, 'handleTokenExpiration');
    component.finishTraining();

    expect((component as any).handleTokenExpiration).toHaveBeenCalled();
  });

  it('should handle 401 error when creating session', () => {
    component.session = null;
    component.programId = 1;
    component.currentUser = mockUser;
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.getToken.and.returnValue('mock-token');
    
    const error401 = { status: 401, error: 'Unauthorized' };
    mockTrainingSessionService.createTrainingSession.and.returnValue(throwError(() => error401));

    spyOn(component as any, 'handleTokenExpiration');
    component.finishTraining();

    expect((component as any).handleTokenExpiration).toHaveBeenCalled();
  });

  it('should handle other errors when creating session', () => {
    component.session = null;
    component.programId = 1;
    component.currentUser = mockUser;
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.getToken.and.returnValue('mock-token');
    
    const error500 = { status: 500, error: 'Internal Server Error' };
    mockTrainingSessionService.createTrainingSession.and.returnValue(throwError(() => error500));

    component.finishTraining();

    expect(component.error).toBe('Erreur lors de la création de la session d\'entraînement');
    expect(component.loading).toBe(false);
  });

  it('should handle token expiration', fakeAsync(() => {
    spyOn(localStorage, 'removeItem');

    (component as any).handleTokenExpiration();

    expect(component.error).toBe('Session expirée. Veuillez vous reconnecter.');
    expect(component.loading).toBe(false);
    expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('current_user');
    
    tick(2000);
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should stop training', () => {
    component.session = {
      id: 1,
      userId: 1,
      trainingProgramId: 1,
      name: 'Test Session',
      description: 'Test session description',
      sessionDate: new Date().toISOString(),
      sessionType: 'Strength',
      durationMinutes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isCompleted: false,
      exercises: []
    };

    spyOn(component as any, 'saveTrainingSession');
    component.stopTraining();

    expect(component.isTrainingComplete).toBe(false);
    expect(component.session?.endTime).toBeDefined();
    expect((component as any).saveTrainingSession).toHaveBeenCalled();
  });

  it('should get muscle group color', () => {
    expect(component.getMuscleGroupColor('CHEST')).toBe('#FF5722');
    expect(component.getMuscleGroupColor('BACK')).toBe('#2196F3');
    expect(component.getMuscleGroupColor('UNKNOWN')).toBe('#666');
  });

  it('should get equipment icon', () => {
    expect(component.getEquipmentIcon('DUMBBELLS')).toBe('fas fa-dumbbell');
    expect(component.getEquipmentIcon('BARBELL')).toBe('fas fa-weight-hanging');
    expect(component.getEquipmentIcon('UNKNOWN')).toBe('fas fa-dumbbell');
  });

  it('should handle back button with confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(component, 'stopTraining');

    component.onBack();

    expect(window.confirm).toHaveBeenCalled();
    expect(component.stopTraining).toHaveBeenCalled();
  });

  it('should not stop training if user cancels', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    spyOn(component, 'stopTraining');

    component.onBack();

    expect(window.confirm).toHaveBeenCalled();
    expect(component.stopTraining).not.toHaveBeenCalled();
  });

  it('should clear error and reload exercises', () => {
    component.error = 'Test error';
    spyOn(component, 'loadExercises');

    component.clearError();

    expect(component.error).toBeNull();
    expect(component.loadExercises).toHaveBeenCalled();
  });

  it('should clean up timer on destroy', () => {
    spyOn(window, 'clearInterval');
    component.startTimer();
    expect(component.timerInterval).toBeDefined();

    component.ngOnDestroy();
    expect(window.clearInterval).toHaveBeenCalled();
  });
}); 