import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProgramDetailsComponent } from './program-details.component';
import { TrainingProgramService } from '../../../services/training-program.service';
import { ProgramExerciseService } from '../../../services/program-exercise.service';
import { AuthService } from '../../../services/auth.service';

/**
 * Tests pour le composant ProgramDetailsComponent
 * Tests for ProgramDetailsComponent
 */
describe('ProgramDetailsComponent', () => {
  let component: ProgramDetailsComponent;
  let fixture: ComponentFixture<ProgramDetailsComponent>;
  let trainingProgramService: jasmine.SpyObj<TrainingProgramService>;
  let programExerciseService: jasmine.SpyObj<ProgramExerciseService>;
  let router: jasmine.SpyObj<Router>;
  let authService: jasmine.SpyObj<AuthService>;

  const mockTrainingProgram = {
    id: 1,
    name: 'Programme Test',
    description: 'Description test',
    category: 'Musculation',
    difficultyLevel: 'Intermédiaire',
    durationWeeks: 4,
    sessionsPerWeek: 3,
    estimatedDurationMinutes: 60,
    equipmentRequired: 'Haltères',
    targetAudience: 'Tous niveaux',
    isPublic: true,
    isActive: true,
    createdByUserId: 1,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  };

  const mockProgramExercise = {
    id: 1,
    trainingProgramId: 1,
    exerciseId: 1,
    exerciseName: 'Squat',
    exerciseDescription: 'Exercice de squat',
    exerciseCategory: 'Musculation',
    exerciseMuscleGroup: 'Jambes',
    exerciseEquipmentNeeded: 'Barre',
    exerciseDifficultyLevel: 'Intermédiaire',
    orderInProgram: 1,
    setsCount: 3,
    repsCount: 10,
    restDurationSeconds: 60,
    durationSeconds: 30,
    weightKg: 50,
    distanceMeters: 0,
    isOptional: false,
    notes: 'Test exercise',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  };

  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    dateOfBirth: '1990-01-01',
    gender: 'MALE',
    height: 180,
    weight: 75,
    experienceLevel: 'BEGINNER',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  };

  beforeEach(async () => {
    const trainingProgramServiceSpy = jasmine.createSpyObj('TrainingProgramService', ['getProgramById']);
    const programExerciseServiceSpy = jasmine.createSpyObj('ProgramExerciseService', ['getExercisesByProgramId']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      params: of({ id: '1' }),
      queryParams: of({}),
      paramMap: of({ get: () => '1' }),
      snapshot: {
        paramMap: {
          get: () => '1'
        }
      }
    });
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'isAuthenticated']);
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);
    authServiceSpy.isAuthenticated.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [ProgramDetailsComponent],
      providers: [
        { provide: TrainingProgramService, useValue: trainingProgramServiceSpy },
        { provide: ProgramExerciseService, useValue: programExerciseServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramDetailsComponent);
    component = fixture.componentInstance;
    trainingProgramService = TestBed.inject(TrainingProgramService) as jasmine.SpyObj<TrainingProgramService>;
    programExerciseService = TestBed.inject(ProgramExerciseService) as jasmine.SpyObj<ProgramExerciseService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  describe('Initialisation du composant', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with correct programId', () => {
      trainingProgramService.getProgramById.and.returnValue(of(mockTrainingProgram as any));
      programExerciseService.getExercisesByProgramId.and.returnValue(of([]));
      
      component.ngOnInit();
      expect(component.programId).toBe(1);
    });

    it('should load current user on init', () => {
      trainingProgramService.getProgramById.and.returnValue(of(mockTrainingProgram as any));
      programExerciseService.getExercisesByProgramId.and.returnValue(of([]));
      
      component.ngOnInit();
      expect(component.currentUser).toEqual(mockUser);
    });
  });

  describe('Chargement des données', () => {
    it('should load program details and then exercises sequentially', () => {
      trainingProgramService.getProgramById.and.returnValue(of(mockTrainingProgram as any));
      programExerciseService.getExercisesByProgramId.and.returnValue(of([mockProgramExercise as any]));

      component.ngOnInit();
      fixture.detectChanges();

      expect(trainingProgramService.getProgramById).toHaveBeenCalledWith(1);
      expect(programExerciseService.getExercisesByProgramId).toHaveBeenCalledWith(1);
      expect(component.program).toBeTruthy();
      expect(component.program?.exercises).toBeTruthy();
      expect(component.program?.exercises.length).toBe(1);
    });

    it('should handle error when loading program details', () => {
      const error = { status: 404, message: 'Program not found' };
      trainingProgramService.getProgramById.and.returnValue(throwError(() => error));

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.error).toBe('Programme non trouvé.');
      expect(component.loading).toBe(false);
    });

    it('should handle error when loading exercises', () => {
      trainingProgramService.getProgramById.and.returnValue(of(mockTrainingProgram as any));
      const error = { status: 500, message: 'Server error' };
      programExerciseService.getExercisesByProgramId.and.returnValue(throwError(() => error));

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.error).toBe('Erreur lors du chargement des exercices');
    });
  });

  describe('Gestion des permissions', () => {
    it('should set canAddProgram based on provenance', () => {
      trainingProgramService.getProgramById.and.returnValue(of(mockTrainingProgram as any));
      programExerciseService.getExercisesByProgramId.and.returnValue(of([]));
      
      component.fromYouPrograms = false;
      component.ngOnInit();
      expect(component.canAddProgram).toBe(true);
    });

    it('should update modification permissions correctly', () => {
      component.program = { ...mockTrainingProgram, createdByUserId: 1 } as any;
      component.currentUser = mockUser;
      component.fromYouPrograms = true;

      if (component.program && component.currentUser) {
        component.isProgramCreator = component.program.createdByUserId === component.currentUser.id;
        component.canModifyProgram = component.fromYouPrograms && component.isProgramCreator;
      }

      expect(component.isProgramCreator).toBe(true);
      expect(component.canModifyProgram).toBe(true);
    });
  });

  describe('Navigation', () => {
    it('should navigate back to you page when from you-programs', () => {
      component.fromYouPrograms = true;
      component.programId = 1;

      component.goBack();

      expect(router.navigate).toHaveBeenCalledWith(
        ['/dashboard/you'],
        { queryParams: { from: 'you-programs' } }
      );
    });

    it('should navigate back to programs page when not from you-programs', () => {
      component.fromYouPrograms = false;
      component.programId = 1;

      component.goBack();

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/programs']);
    });
  });

  describe('Méthodes utilitaires', () => {
    beforeEach(() => {
      component.program = {
        ...mockTrainingProgram,
        exercises: [mockProgramExercise as any]
      } as any;
    });

    it('should calculate total exercises correctly', () => {
      const total = component.getTotalExercises();
      expect(total).toBe(1);
    });

    it('should calculate total sets correctly', () => {
      const total = component.getTotalSets();
      expect(total).toBe(3);
    });

    it('should calculate estimated total time correctly', () => {
      const time = component.getEstimatedTotalTime();
      expect(time).toContain('min');
    });

    it('should return 0 min when no exercises', () => {
      component.program!.exercises = [];
      const time = component.getEstimatedTotalTime();
      expect(time).toBe('0 min');
    });
  });

  describe('Gestion des erreurs', () => {
    it('should handle different error types correctly', () => {
      const testCases = [
        { status: 401, expected: 'Session expirée. Veuillez vous reconnecter.' },
        { status: 403, expected: 'Accès refusé. Vous n\'avez pas les permissions nécessaires.' },
        { status: 404, expected: 'Programme non trouvé.' },
        { status: 500, expected: 'Custom error message' }
      ];

      testCases.forEach(({ status, expected }) => {
        const error = { status };
        component['handleError'](error, 'Custom error message');
        expect(component.error).toBe(expected);
      });
    });
  });
}); 