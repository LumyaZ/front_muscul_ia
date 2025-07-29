import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { AddExerciseToProgramComponent } from './add-exercise-to-program.component';
import { ExerciseService } from '../../../services/exercise.service';
import { ProgramExerciseService } from '../../../services/program-exercise.service';
import { HeaderComponent } from '../../../components/header/header.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';

describe('AddExerciseToProgramComponent', () => {
  let component: AddExerciseToProgramComponent;
  let fixture: ComponentFixture<AddExerciseToProgramComponent>;
  let mockExerciseService: jasmine.SpyObj<ExerciseService>;
  let mockProgramExerciseService: jasmine.SpyObj<ProgramExerciseService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

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
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      params: of({ id: '123' })
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
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    }).compileComponents();

    mockExerciseService = TestBed.inject(ExerciseService) as jasmine.SpyObj<ExerciseService>;
    mockProgramExerciseService = TestBed.inject(ProgramExerciseService) as jasmine.SpyObj<ProgramExerciseService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockActivatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with program ID from route params', () => {
    expect(component.programId).toBe(123);
  });

  it('should load available exercises on init', () => {
    expect(mockExerciseService.getAllExercises).toHaveBeenCalled();
    expect(component.availableExercises).toEqual(mockExercises);
  });

  it('should create form with required controls', () => {
    expect(component.addExerciseForm.get('exerciseId')).toBeTruthy();
    expect(component.addExerciseForm.get('orderInProgram')).toBeTruthy();
    expect(component.addExerciseForm.get('setsCount')).toBeTruthy();
    expect(component.addExerciseForm.get('restDurationSeconds')).toBeTruthy();
  });

  it('should validate required fields', () => {
    const form = component.addExerciseForm;
    
    expect(form.valid).toBeFalsy();
    
    form.patchValue({
      exerciseId: 1,
      orderInProgram: 1,
      setsCount: 3,
      restDurationSeconds: 60
    });
    
    expect(form.valid).toBeTruthy();
  });

  it('should get exercise display name correctly', () => {
    const displayName = component.getExerciseDisplayName(1);
    expect(displayName).toBe('Push-ups');
  });

  it('should return unknown exercise for invalid ID', () => {
    const displayName = component.getExerciseDisplayName(999);
    expect(displayName).toBe('Exercice inconnu');
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

  it('should navigate back to program on goBackToProgram', () => {
    component.goBackToProgram();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/programs', 123]);
  });

  it('should navigate back to programs on goBackToPrograms', () => {
    component.goBackToPrograms();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/programs']);
  });

  it('should mark form as touched when submitting invalid form', () => {
    spyOn(component, 'markFormGroupTouched');
    component.onSubmit();
    expect(component.markFormGroupTouched).toHaveBeenCalled();
  });

  it('should handle form submission with valid data', () => {
    spyOn(console, 'log');
    component.addExerciseForm.patchValue({
      exerciseId: 1,
      orderInProgram: 1,
      setsCount: 3,
      restDurationSeconds: 60
    });

    component.onSubmit();

    expect(component.loading).toBeFalsy();
    expect(component.success).toBe('Exercice ajouté au programme avec succès ! (Simulation)');
    expect(console.log).toHaveBeenCalled();
  });

  it('should handle loading state correctly', () => {
    component.loading = true;
    fixture.detectChanges();
    
    const loadingElement = fixture.nativeElement.querySelector('.loading');
    expect(loadingElement).toBeTruthy();
  });

  it('should handle error state correctly', () => {
    component.error = 'Test error message';
    fixture.detectChanges();
    
    const errorElement = fixture.nativeElement.querySelector('.error-message');
    expect(errorElement.textContent).toContain('Test error message');
  });

  it('should handle success state correctly', () => {
    component.success = 'Test success message';
    fixture.detectChanges();
    
    const successElement = fixture.nativeElement.querySelector('.success-message');
    expect(successElement.textContent).toContain('Test success message');
  });
}); 