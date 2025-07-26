import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProgramDetailsComponent } from './program-details.component';
import { TrainingProgramService } from '../../../services/training-program.service';
import { ProgramExerciseService } from '../../../services/program-exercise.service';
import { TrainingProgram } from '../../../services/training-program.service';
import { ProgramExercise } from '../../../services/program-exercise.service';

describe('ProgramDetailsComponent', () => {
  let component: ProgramDetailsComponent;
  let fixture: ComponentFixture<ProgramDetailsComponent>;
  let trainingProgramService: jasmine.SpyObj<TrainingProgramService>;
  let programExerciseService: jasmine.SpyObj<ProgramExerciseService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;

  const mockTrainingProgram: TrainingProgram = {
    id: 1,
    name: 'Programme Débutant',
    description: 'Programme pour débuter en musculation',
    difficultyLevel: 'Débutant',
    durationWeeks: 8,
    sessionsPerWeek: 3,
    estimatedDurationMinutes: 45,
    category: 'Musculation',
    targetAudience: 'Débutants',
    equipmentRequired: 'Poids du corps',
    isPublic: true,
    isActive: true,
    createdByUserId: 1,
    createdAt: '2024-01-01T00:00:00',
    updatedAt: '2024-01-01T00:00:00'
  };

  const mockProgramExercise: ProgramExercise = {
    id: 1,
    trainingProgramId: 1,
    exerciseId: 1,
    exerciseName: 'Pompes',
    exerciseDescription: 'Exercice de musculation pour les pectoraux',
    exerciseCategory: 'Musculation',
    exerciseMuscleGroup: 'Pectoraux',
    exerciseEquipmentNeeded: 'Poids du corps',
    exerciseDifficultyLevel: 'Débutant',
    orderInProgram: 1,
    setsCount: 3,
    repsCount: 12,
    durationSeconds: 60,
    restDurationSeconds: 90,
    weightKg: 0,
    distanceMeters: 0,
    notes: 'Exercice de base',
    isOptional: false,
    createdAt: '2024-01-01T00:00:00',
    updatedAt: '2024-01-01T00:00:00'
  };

  beforeEach(async () => {
    const trainingProgramServiceSpy = jasmine.createSpyObj('TrainingProgramService', ['getProgramById']);
    const programExerciseServiceSpy = jasmine.createSpyObj('ProgramExerciseService', ['getExercisesByProgramId']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      params: of({ id: '1' })
    });

    await TestBed.configureTestingModule({
      imports: [ProgramDetailsComponent],
      providers: [
        { provide: TrainingProgramService, useValue: trainingProgramServiceSpy },
        { provide: ProgramExerciseService, useValue: programExerciseServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramDetailsComponent);
    component = fixture.componentInstance;
    trainingProgramService = TestBed.inject(TrainingProgramService) as jasmine.SpyObj<TrainingProgramService>;
    programExerciseService = TestBed.inject(ProgramExerciseService) as jasmine.SpyObj<ProgramExerciseService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load program details and exercises on init', () => {
      // Given
      trainingProgramService.getProgramById.and.returnValue(of(mockTrainingProgram));
      programExerciseService.getExercisesByProgramId.and.returnValue(of([mockProgramExercise]));

      // When
      component.ngOnInit();

      // Then
      expect(component.programId).toBe(1);
      expect(trainingProgramService.getProgramById).toHaveBeenCalledWith(1);
      expect(programExerciseService.getExercisesByProgramId).toHaveBeenCalledWith(1);
      expect(component.program).toBeTruthy();
      expect(component.program?.id).toBe(mockTrainingProgram.id);
      expect(component.program?.name).toBe(mockTrainingProgram.name);
      expect(component.program?.exercises).toBeTruthy();
      expect(component.program?.exercises?.length).toBe(1);
      expect(component.program?.exercises?.[0]?.id).toBe(mockProgramExercise.id);
      expect(component.program?.exercises?.[0]?.exerciseId).toBe(mockProgramExercise.exerciseId);
      expect(component.loading).toBeFalse();
      expect(component.error).toBe('');
    });

    it('should handle program loading error', () => {
      // Given
      const errorMessage = 'Program not found';
      trainingProgramService.getProgramById.and.returnValue(throwError(() => new Error(errorMessage)));

      // When
      component.ngOnInit();

      // Then
      expect(component.error).toBe('Erreur lors du chargement du programme');
      expect(component.loading).toBeFalse();
      expect(component.program).toBeNull();
    });

    it('should handle exercises loading error', () => {
      // Given
      trainingProgramService.getProgramById.and.returnValue(of(mockTrainingProgram));
      programExerciseService.getExercisesByProgramId.and.returnValue(throwError(() => new Error('Exercises not found')));

      // When
      component.ngOnInit();

      // Then
      expect(component.error).toBe('Erreur lors du chargement des exercices');
      expect(component.loading).toBeFalse();
      // Le programme peut encore être présent même si les exercices échouent
      expect(component.program).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should navigate back to programs list', () => {
      // When
      component.goBack();

      // Then
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/programs']);
    });

    it('should handle start program action', () => {
      // Given
      spyOn(console, 'log');

      // When
      component.startProgram();

      // Then
      expect(console.log).toHaveBeenCalledWith('Démarrage du programme:', undefined);
    });
  });

  describe('Helper methods', () => {
    beforeEach(() => {
      component.program = {
        ...mockTrainingProgram,
        exercises: [mockProgramExercise]
      } as any;
    });

    it('should return correct difficulty color', () => {
      expect(component.getDifficultyColor('Débutant')).toBe('#4CAF50');
      expect(component.getDifficultyColor('Intermédiaire')).toBe('#FF9800');
      expect(component.getDifficultyColor('Avancé')).toBe('#F44336');
      expect(component.getDifficultyColor('Unknown')).toBe('#757575');
    });

    it('should return correct category icon', () => {
      expect(component.getCategoryIcon('Musculation')).toBe('💪');
      expect(component.getCategoryIcon('Cardio')).toBe('❤️');
      expect(component.getCategoryIcon('Flexibilité')).toBe('🧘');
      expect(component.getCategoryIcon('Mixte')).toBe('⚡');
      expect(component.getCategoryIcon('Unknown')).toBe('🏋️');
    });

    it('should return correct category color', () => {
      expect(component.getCategoryColor('Musculation')).toBe('linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
      expect(component.getCategoryColor('Cardio')).toBe('linear-gradient(135deg, #f093fb 0%, #f5576c 100%)');
      expect(component.getCategoryColor('Flexibilité')).toBe('linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)');
      expect(component.getCategoryColor('Mixte')).toBe('linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)');
      expect(component.getCategoryColor('Unknown')).toBe('linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
    });

    it('should format duration correctly', () => {
      expect(component.formatDuration(45)).toBe('45 min');
      expect(component.formatDuration(60)).toBe('1h');
      expect(component.formatDuration(90)).toBe('1h30');
      expect(component.formatDuration(120)).toBe('2h');
    });

    it('should format rest duration correctly', () => {
      expect(component.formatRestDuration(30)).toBe('30s');
      expect(component.formatRestDuration(60)).toBe('1m');
      expect(component.formatRestDuration(90)).toBe('1m30s');
      expect(component.formatRestDuration(120)).toBe('2m');
    });

    it('should format exercise duration correctly', () => {
      expect(component.formatExerciseDuration(30)).toBe('30s');
      expect(component.formatExerciseDuration(60)).toBe('1m');
      expect(component.formatExerciseDuration(90)).toBe('1m30s');
      expect(component.formatExerciseDuration(120)).toBe('2m');
    });

    it('should calculate total exercises correctly', () => {
      expect(component.getTotalExercises()).toBe(1);
    });

    it('should calculate total sets correctly', () => {
      expect(component.getTotalSets()).toBe(3);
    });

    it('should calculate estimated total time correctly', () => {
      expect(component.getEstimatedTotalTime()).toBe('6 min');
    });
  });

  describe('Edge cases', () => {
    it('should handle null program gracefully', () => {
      component.program = null;
      
      expect(component.getTotalExercises()).toBe(0);
      expect(component.getTotalSets()).toBe(0);
      expect(component.getEstimatedTotalTime()).toBe('0 min');
    });

    it('should handle empty exercises array gracefully', () => {
      component.program = {
        ...mockTrainingProgram,
        exercises: []
      } as any;

      expect(component.getTotalExercises()).toBe(0);
      expect(component.getTotalSets()).toBe(0);
      expect(component.getEstimatedTotalTime()).toBe('0 min');
    });

    it('should handle exercises with null values gracefully', () => {
      const exerciseWithNulls = {
        ...mockProgramExercise,
        setsCount: null,
        durationSeconds: null,
        restDurationSeconds: null
      };

      component.program = {
        ...mockTrainingProgram,
        exercises: [exerciseWithNulls]
      } as any;

      expect(component.getTotalSets()).toBe(0);
      expect(component.getEstimatedTotalTime()).toBe('0 min');
    });
  });

  describe('Loading states', () => {
    it('should show loading state initially', () => {
      expect(component.loading).toBeFalse();
      expect(component.error).toBe('');
    });

    it('should handle loading state during API calls', () => {
      // Given
      trainingProgramService.getProgramById.and.returnValue(of(mockTrainingProgram));
      programExerciseService.getExercisesByProgramId.and.returnValue(of([mockProgramExercise]));

      // When
      component.loadProgramDetails();

      // Then
      // Le loading est mis à false après le chargement réussi
      expect(component.loading).toBeFalse();
      expect(component.error).toBe('');
    });
  });
}); 