import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { AddExerciseToProgramComponent } from './add-exercise-to-program.component';
import { ExerciseService } from '../../../services/exercise.service';
import { ProgramExerciseService } from '../../../services/program-exercise.service';
import { AuthService } from '../../../services/auth.service';
import { HeaderComponent } from '../../../components/header/header.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';

/**
 * Tests pour le composant AddExerciseToProgramComponent
 * Tests for AddExerciseToProgramComponent
 */
describe('AddExerciseToProgramComponent', () => {
  let component: AddExerciseToProgramComponent;
  let fixture: ComponentFixture<AddExerciseToProgramComponent>;
  let mockExerciseService: jasmine.SpyObj<ExerciseService>;
  let mockProgramExerciseService: jasmine.SpyObj<ProgramExerciseService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

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

  const mockExercises = [
    {
      id: 1,
      name: 'Push-ups',
      description: 'Classic push-ups',
      category: 'Strength',
      muscleGroup: 'Chest',
      equipmentNeeded: 'None',
      difficultyLevel: 'Beginner',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: 2,
      name: 'Squats',
      description: 'Bodyweight squats',
      category: 'Strength',
      muscleGroup: 'Legs',
      equipmentNeeded: 'None',
      difficultyLevel: 'Beginner',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
  ];

  beforeEach(async () => {
    const exerciseServiceSpy = jasmine.createSpyObj('ExerciseService', ['getAllExercises']);
    const programExerciseServiceSpy = jasmine.createSpyObj('ProgramExerciseService', ['addExerciseToProgram']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'isAuthenticated']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      params: of({ id: '123' }),
      queryParams: of({ from: 'you-programs' })
    });

    await TestBed.configureTestingModule({
      imports: [
        AddExerciseToProgramComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
        HeaderComponent,
        NavBarComponent
      ],
      providers: [
        { provide: ExerciseService, useValue: exerciseServiceSpy },
        { provide: ProgramExerciseService, useValue: programExerciseServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    }).compileComponents();

    mockExerciseService = TestBed.inject(ExerciseService) as jasmine.SpyObj<ExerciseService>;
    mockProgramExerciseService = TestBed.inject(ProgramExerciseService) as jasmine.SpyObj<ProgramExerciseService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockActivatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;

    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockExerciseService.getAllExercises.and.returnValue(of(mockExercises));
    mockProgramExerciseService.addExerciseToProgram.and.returnValue(of({
      id: 1,
      trainingProgramId: 123,
      exerciseId: 1,
      exerciseName: 'Push-ups',
      exerciseDescription: 'Classic push-ups',
      exerciseCategory: 'Strength',
      exerciseMuscleGroup: 'Chest',
      exerciseEquipmentNeeded: 'None',
      exerciseDifficultyLevel: 'Beginner',
      orderInProgram: 1,
      setsCount: 3,
      repsCount: 10,
      restDurationSeconds: 60,
      durationSeconds: 30,
      weightKg: 0,
      distanceMeters: 0,
      isOptional: false,
      notes: 'Test exercise',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExerciseToProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Initialisation du composant', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with correct values', () => {
      expect(component.programId).toBe(123);
      expect(component.currentUser).toEqual(mockUser);
      expect(component.fromYouPrograms).toBe(true);
    });
  });

  describe('Chargement des exercices', () => {
    it('should load available exercises successfully', () => {
      component.loadAvailableExercises();
      
      expect(mockExerciseService.getAllExercises).toHaveBeenCalled();
      expect(component.availableExercises).toEqual(mockExercises);
      expect(component.loading).toBe(false);
    });

    it('should handle error when loading exercises', () => {
      const error = { status: 500, message: 'Server error' };
      mockExerciseService.getAllExercises.and.returnValue(throwError(() => error));
      
      component.loadAvailableExercises();
      
      expect(component.error).toBe('Erreur lors du chargement des exercices');
      expect(component.loading).toBe(false);
    });
  });

  describe('Gestion du formulaire', () => {
    it('should initialize form with correct structure', () => {
      expect(component.addExerciseForm.get('exerciseId')).toBeTruthy();
      expect(component.addExerciseForm.get('orderInProgram')).toBeTruthy();
      expect(component.addExerciseForm.get('setsCount')).toBeTruthy();
      expect(component.addExerciseForm.get('restDurationSeconds')).toBeTruthy();
    });

    it('should submit form successfully', () => {
      component.addExerciseForm.patchValue({
        exerciseId: 1,
        orderInProgram: 1,
        setsCount: 3,
        restDurationSeconds: 60
      });
      
      component.onSubmit();
      
      expect(mockProgramExerciseService.addExerciseToProgram).toHaveBeenCalledWith(123, jasmine.any(Object));
      expect(component.success).toBe('Exercice ajouté au programme avec succès !');
    });

    it('should handle error during form submission', () => {
      const error = { status: 400, message: 'Bad request' };
      mockProgramExerciseService.addExerciseToProgram.and.returnValue(throwError(() => error));
      
      component.addExerciseForm.patchValue({
        exerciseId: 1,
        orderInProgram: 1,
        setsCount: 3,
        restDurationSeconds: 60
      });
      
      component.onSubmit();
      
      expect(component.error).toBe('Erreur lors de l\'ajout de l\'exercice au programme');
    });
  });

  describe('Navigation', () => {
    it('should navigate back to program with correct parameters when from you-programs', () => {
      component.fromYouPrograms = true;
      component.currentUser = mockUser;
      
      component.goBackToProgram();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/dashboard/programs', 123],
        {
          queryParams: {
            from: 'you-programs',
            userId: mockUser.id
          }
        }
      );
    });

    it('should navigate back to program without parameters when not from you-programs', () => {
      component.fromYouPrograms = false;
      
      component.goBackToProgram();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/programs', 123]);
    });
  });

  describe('Méthodes utilitaires', () => {
    it('should get exercise display name correctly', () => {
      component.availableExercises = mockExercises;
      
      const displayName = component.getExerciseDisplayName(1);
      
      expect(displayName).toBe('Push-ups');
    });

    it('should get error message for required field', () => {
      const control = component.addExerciseForm.get('exerciseId');
      control?.markAsTouched();
      control?.setErrors({ required: true });
      
      const errorMessage = component.getErrorMessage('exerciseId');
      
      expect(errorMessage).toBe('Ce champ est requis');
    });

    it('should get error message for min value', () => {
      const control = component.addExerciseForm.get('orderInProgram');
      control?.markAsTouched();
      control?.setErrors({ min: { min: 1 } });
      
      const errorMessage = component.getErrorMessage('orderInProgram');
      
      expect(errorMessage).toBe('La valeur minimale est 1');
    });
  });

  describe('Gestion des erreurs', () => {
    it('should handle different error types', () => {
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