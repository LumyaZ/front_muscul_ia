import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProgramDetailsComponent } from './program-details.component';
import { TrainingProgramService } from '../../../services/training-program.service';
import { ProgramExerciseService } from '../../../services/program-exercise.service';
import { AuthService } from '../../../services/auth.service';

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
    difficulty: 'Intermédiaire',
    duration: 60,
    creatorId: 1,
    creatorName: 'Test User',
    exercises: []
  };

  const mockProgramExercise = {
    id: 1,
    programId: 1,
    exerciseId: 1,
    exercise: {
      id: 1,
      name: 'Squat',
      description: 'Exercice de squat',
      muscleGroup: 'Jambes',
      equipment: 'Barre',
      difficulty: 'Intermédiaire',
      instructions: 'Instructions test',
      imageUrl: 'test.jpg'
    },
    order: 1,
    sets: 3,
    reps: 10,
    restTime: 60,
    isOptional: false
  };

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    username: 'testuser'
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize provenance properties correctly', () => {
    trainingProgramService.getProgramById.and.returnValue(of(mockTrainingProgram as any));
    programExerciseService.getExercisesByProgramId.and.returnValue(of([mockProgramExercise as any]));

    component.ngOnInit();

    expect(component.fromYouPrograms).toBe(false);
    expect(component.canAddProgram).toBe(true);
    expect(component.isProgramCreator).toBe(false);
    expect(component.canModifyProgram).toBe(false);
  });

  it('should load program details successfully', () => {
    trainingProgramService.getProgramById.and.returnValue(of(mockTrainingProgram as any));
    programExerciseService.getExercisesByProgramId.and.returnValue(of([mockProgramExercise as any]));

    component.ngOnInit();

    expect(component.program).toBeTruthy();
    expect(component.loading).toBe(false);
    expect(component.error).toBe('');
  });

  it('should handle error when loading program details', () => {
    const errorMessage = 'Erreur lors du chargement';
    trainingProgramService.getProgramById.and.returnValue(throwError(() => new Error(errorMessage)));
    programExerciseService.getExercisesByProgramId.and.returnValue(of([]));

    component.ngOnInit();

    expect(component.error).toBe('Erreur lors du chargement du programme');
    expect(component.loading).toBe(false);
  });

  it('should add program to user when addProgramToUser is called', () => {
    component.currentUser = mockUser;
    component.program = mockTrainingProgram as any;
    spyOn(console, 'log');
    spyOn(window, 'alert');

    component.addProgramToUser();

    expect(console.log).toHaveBeenCalledWith('Ajouter le programme', mockTrainingProgram.id, 'à l\'utilisateur', mockUser.id);
    expect(window.alert).toHaveBeenCalledWith('Programme ajouté à vos programmes !');
  });

  it('should not add program to user when user is null', () => {
    component.currentUser = null;
    component.program = mockTrainingProgram as any;
    spyOn(console, 'log');

    component.addProgramToUser();

    expect(console.log).not.toHaveBeenCalled();
  });

  it('should not add program to user when program is null', () => {
    component.currentUser = mockUser;
    component.program = null;
    spyOn(console, 'log');

    component.addProgramToUser();

    expect(console.log).not.toHaveBeenCalled();
  });
}); 