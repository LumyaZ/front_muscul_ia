import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ProgramRecapComponent } from './program-recap.component';
import { TrainingProgramService } from '../../../../services/training-program.service';
import { ProgramExerciseService } from '../../../../services/program-exercise.service';

describe('ProgramRecapComponent', () => {
  let component: ProgramRecapComponent;
  let fixture: ComponentFixture<ProgramRecapComponent>;
  let mockTrainingProgramService: jasmine.SpyObj<TrainingProgramService>;
  let mockProgramExerciseService: jasmine.SpyObj<ProgramExerciseService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  const mockTrainingProgram = {
    id: 1,
    name: 'Test Program',
    description: 'Test Description',
    difficultyLevel: 'BEGINNER',
    durationWeeks: 4,
    sessionsPerWeek: 3,
    estimatedDurationMinutes: 45,
    category: 'STRENGTH',
    targetAudience: 'BEGINNER',
    equipmentRequired: 'DUMBBELLS',
    isPublic: true,
    isActive: true,
    createdByUserId: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  };

  const mockProgramExercises = [
    {
      id: 1,
      trainingProgramId: 1,
      exerciseId: 1,
      exerciseName: 'Push-ups',
      exerciseDescription: 'Basic push-ups',
      exerciseCategory: 'STRENGTH',
      exerciseMuscleGroup: 'CHEST',
      exerciseEquipmentNeeded: 'BODYWEIGHT',
      exerciseDifficultyLevel: 'BEGINNER',
      orderInProgram: 1,
      setsCount: 3,
      repsCount: 10,
      durationSeconds: 30,
      restDurationSeconds: 60,
      weightKg: 0,
      distanceMeters: 0,
      notes: 'Keep proper form',
      isOptional: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ] as any;

  beforeEach(async () => {
    const trainingProgramServiceSpy = jasmine.createSpyObj('TrainingProgramService', ['getProgramById']);
    const programExerciseServiceSpy = jasmine.createSpyObj('ProgramExerciseService', ['getExercisesByProgramId']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1')
        }
      }
    });

    await TestBed.configureTestingModule({
      declarations: [ ProgramRecapComponent ],
      providers: [
        { provide: TrainingProgramService, useValue: trainingProgramServiceSpy },
        { provide: ProgramExerciseService, useValue: programExerciseServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    })
    .compileComponents();

    mockTrainingProgramService = TestBed.inject(TrainingProgramService) as jasmine.SpyObj<TrainingProgramService>;
    mockProgramExerciseService = TestBed.inject(ProgramExerciseService) as jasmine.SpyObj<ProgramExerciseService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockActivatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramRecapComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load program details on init', () => {
    mockTrainingProgramService.getProgramById.and.returnValue(of(mockTrainingProgram));
    mockProgramExerciseService.getExercisesByProgramId.and.returnValue(of(mockProgramExercises));
    
    component.ngOnInit();
    
    expect(mockTrainingProgramService.getProgramById).toHaveBeenCalledWith(1);
    expect(component.program).toEqual(mockTrainingProgram);
    expect(component.programId).toBe(1);
  });

  it('should handle invalid program id', () => {
    (mockActivatedRoute.snapshot.paramMap.get as jasmine.Spy).and.returnValue(null);
    
    component.ngOnInit();
    
    expect(component.error).toBe('ID de programme invalide');
  });

  it('should handle error when loading program', () => {
    mockTrainingProgramService.getProgramById.and.returnValue(of(null as any));
    
    component.ngOnInit();
    
    expect(component.error).toBeTruthy();
    expect(component.loading).toBeFalse();
  });

  it('should navigate back when onBack is called', () => {
    component.onBack();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/record/select-program']);
  });

  it('should start training session', () => {
    component.program = mockTrainingProgram;
    spyOn(console, 'log');
    
    component.onStartTraining();
    
    expect(console.log).toHaveBeenCalledWith('Démarrage de l\'entraînement pour le programme:', 'Test Program');
  });

  it('should calculate total sets correctly', () => {
    component.exercises = mockProgramExercises;
    
    expect(component.getTotalSets()).toBe(3);
  });

  it('should calculate estimated duration correctly', () => {
    component.exercises = mockProgramExercises;
    
    expect(component.getEstimatedDuration()).toBe(5); // 1 exercise * 5 minutes
  });

  it('should handle empty exercises', () => {
    component.exercises = [];
    
    expect(component.getTotalSets()).toBe(0);
    expect(component.getEstimatedDuration()).toBe(0);
  });

  it('should show loading state initially', () => {
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('');
    expect(component.program).toBeNull();
  });

  it('should get difficulty label correctly', () => {
    expect(component.getDifficultyLabel('BEGINNER')).toBe('Débutant');
    expect(component.getDifficultyLabel('INTERMEDIATE')).toBe('Intermédiaire');
    expect(component.getDifficultyLabel('ADVANCED')).toBe('Avancé');
    expect(component.getDifficultyLabel('UNKNOWN')).toBe('UNKNOWN');
  });

  it('should get difficulty color correctly', () => {
    expect(component.getDifficultyColor('BEGINNER')).toBe('#4CAF50');
    expect(component.getDifficultyColor('INTERMEDIATE')).toBe('#FF9800');
    expect(component.getDifficultyColor('ADVANCED')).toBe('#F44336');
    expect(component.getDifficultyColor('UNKNOWN')).toBe('#666');
  });

  it('should get muscle group color correctly', () => {
    expect(component.getMuscleGroupColor('CHEST')).toBe('#FF5722');
    expect(component.getMuscleGroupColor('BACK')).toBe('#2196F3');
    expect(component.getMuscleGroupColor('LEGS')).toBe('#4CAF50');
    expect(component.getMuscleGroupColor('UNKNOWN')).toBe('#666');
  });

  it('should get equipment icon correctly', () => {
    expect(component.getEquipmentIcon('DUMBBELLS')).toBe('fas fa-dumbbell');
    expect(component.getEquipmentIcon('BARBELL')).toBe('fas fa-weight-hanging');
    expect(component.getEquipmentIcon('BODYWEIGHT')).toBe('fas fa-user');
    expect(component.getEquipmentIcon('UNKNOWN')).toBe('fas fa-dumbbell');
  });

  it('should get equipment label correctly', () => {
    expect(component.getEquipmentLabel('DUMBBELLS')).toBe('Haltères');
    expect(component.getEquipmentLabel('BARBELL')).toBe('Barre');
    expect(component.getEquipmentLabel('BODYWEIGHT')).toBe('Poids du corps');
    expect(component.getEquipmentLabel('UNKNOWN')).toBe('UNKNOWN');
  });
}); 