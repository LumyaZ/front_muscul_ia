import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { TrainingComponent } from './training.component';
import { TrainingProgramService } from '../../../../services/training-program.service';
import { ProgramExerciseService } from '../../../../services/program-exercise.service';
import { TrainingSessionService } from '../../../../services/training-session.service';

describe('TrainingComponent', () => {
  let component: TrainingComponent;
  let fixture: ComponentFixture<TrainingComponent>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockTrainingProgramService: jasmine.SpyObj<TrainingProgramService>;
  let mockProgramExerciseService: jasmine.SpyObj<ProgramExerciseService>;
  let mockTrainingSessionService: jasmine.SpyObj<TrainingSessionService>;

  const mockExercises = [
    {
      id: 1,
      exerciseName: 'Développé couché',
      exerciseDescription: 'Exercice pour les pectoraux',
      exerciseMuscleGroup: 'CHEST',
      setsCount: 3,
      repsCount: 10,
      durationSeconds: 60,
      restDurationSeconds: 90,
      weightKg: 50,
      notes: 'Exercice de base',
      isOptional: false,
      orderInProgram: 1
    },
    {
      id: 2,
      exerciseName: 'Écarté couché',
      exerciseDescription: 'Exercice d\'isolation',
      exerciseMuscleGroup: 'CHEST',
      setsCount: 4,
      repsCount: 12,
      durationSeconds: 45,
      restDurationSeconds: 60,
      weightKg: 20,
      notes: 'Isolation pectoraux',
      isOptional: true,
      orderInProgram: 2
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

    await TestBed.configureTestingModule({
      imports: [TrainingComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: Router, useValue: routerSpy },
        { provide: TrainingProgramService, useValue: trainingProgramServiceSpy },
        { provide: ProgramExerciseService, useValue: programExerciseServiceSpy },
        { provide: TrainingSessionService, useValue: trainingSessionServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingComponent);
    component = fixture.componentInstance;
    mockActivatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockTrainingProgramService = TestBed.inject(TrainingProgramService) as jasmine.SpyObj<TrainingProgramService>;
    mockProgramExerciseService = TestBed.inject(ProgramExerciseService) as jasmine.SpyObj<ProgramExerciseService>;
    mockTrainingSessionService = TestBed.inject(TrainingSessionService) as jasmine.SpyObj<TrainingSessionService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load exercises on init', () => {
    mockProgramExerciseService.getExercisesByProgramId.and.returnValue(of(mockExercises as any));

    component.ngOnInit();

    expect(mockProgramExerciseService.getExercisesByProgramId).toHaveBeenCalledWith(1);
    expect(component.exercises.length).toBe(2);
    expect(component.exercises[0].completedSets).toEqual([false, false, false]);
    expect(component.exercises[1].completedSets).toEqual([false, false, false, false]);
  });

  it('should handle error when loading exercises', () => {
    mockProgramExerciseService.getExercisesByProgramId.and.returnValue(of([]).pipe(() => {
      throw new Error('Test error');
    }));

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

    // Complete first exercise (3 sets)
    component.exercises[0].completedSets = [true, true, true];
    // Complete 2 sets of second exercise (4 sets total)
    component.exercises[1].completedSets = [true, true, false, false];

    expect(component.getOverallProgress()).toBe(71); // (3+2)/(3+4) * 100 = 71%
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

  it('should finish training', () => {
    component.session = {
      userId: 1,
      trainingProgramId: 1,
      startTime: new Date(),
      exercises: []
    };

    spyOn(component, 'saveTrainingSession');
    component.finishTraining();

    expect(component.isTrainingComplete).toBe(true);
    expect(component.session?.endTime).toBeDefined();
    expect(component.saveTrainingSession).toHaveBeenCalled();
  });

  it('should stop training', () => {
    component.session = {
      userId: 1,
      trainingProgramId: 1,
      startTime: new Date(),
      exercises: []
    };

    spyOn(component, 'saveTrainingSession');
    component.stopTraining();

    expect(component.isTrainingComplete).toBe(false);
    expect(component.session?.endTime).toBeDefined();
    expect(component.saveTrainingSession).toHaveBeenCalled();
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

  it('should clean up timer on destroy', () => {
    component.startTimer();
    expect(component.timerInterval).toBeDefined();

    component.ngOnDestroy();
    expect(component.timerInterval).toBeUndefined();
  });
}); 