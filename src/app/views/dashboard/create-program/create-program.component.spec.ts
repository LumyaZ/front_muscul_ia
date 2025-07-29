import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { CreateProgramComponent } from './create-program.component';
import { TrainingProgramService } from '../../../services/training-program.service';
import { HeaderComponent } from '../../../components/header/header.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';

describe('CreateProgramComponent', () => {
  let component: CreateProgramComponent;
  let fixture: ComponentFixture<CreateProgramComponent>;
  let mockTrainingProgramService: jasmine.SpyObj<TrainingProgramService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockCreatedProgram = {
    id: 1,
    name: 'Test Program',
    description: 'Test Description',
    difficultyLevel: 'Débutant',
    durationWeeks: 4,
    sessionsPerWeek: 3,
    estimatedDurationMinutes: 60,
    category: 'Musculation',
    targetAudience: 'Tous niveaux',
    equipmentRequired: 'Haltères',
    isPublic: true,
    isActive: true,
    createdByUserId: 1,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  };

  beforeEach(async () => {
    const trainingProgramServiceSpy = jasmine.createSpyObj('TrainingProgramService', ['createTrainingProgram']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        CreateProgramComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
        HeaderComponent,
        NavBarComponent
      ],
      providers: [
        { provide: TrainingProgramService, useValue: trainingProgramServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    mockTrainingProgramService = TestBed.inject(TrainingProgramService) as jasmine.SpyObj<TrainingProgramService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    mockTrainingProgramService.createTrainingProgram.and.returnValue(of(mockCreatedProgram));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.createProgramForm.get('category')?.value).toBe('Musculation');
    expect(component.createProgramForm.get('difficultyLevel')?.value).toBe('Débutant');
    expect(component.createProgramForm.get('targetAudience')?.value).toBe('Tous niveaux');
    expect(component.createProgramForm.get('durationWeeks')?.value).toBe(4);
    expect(component.createProgramForm.get('sessionsPerWeek')?.value).toBe(3);
    expect(component.createProgramForm.get('estimatedDurationMinutes')?.value).toBe(60);
    expect(component.createProgramForm.get('isPublic')?.value).toBe(true);
  });

  it('should create form with required controls', () => {
    expect(component.createProgramForm.get('name')).toBeTruthy();
    expect(component.createProgramForm.get('description')).toBeTruthy();
    expect(component.createProgramForm.get('category')).toBeTruthy();
    expect(component.createProgramForm.get('difficultyLevel')).toBeTruthy();
    expect(component.createProgramForm.get('targetAudience')).toBeTruthy();
    expect(component.createProgramForm.get('durationWeeks')).toBeTruthy();
    expect(component.createProgramForm.get('sessionsPerWeek')).toBeTruthy();
    expect(component.createProgramForm.get('estimatedDurationMinutes')).toBeTruthy();
    expect(component.createProgramForm.get('equipmentRequired')).toBeTruthy();
    expect(component.createProgramForm.get('isPublic')).toBeTruthy();
  });

  it('should validate required fields', () => {
    const form = component.createProgramForm;
    
    expect(form.valid).toBeFalsy();
    
    form.patchValue({
      name: 'Test Program',
      description: 'Test Description',
      category: 'Musculation',
      difficultyLevel: 'Débutant',
      targetAudience: 'Tous niveaux',
      durationWeeks: 4,
      sessionsPerWeek: 3,
      estimatedDurationMinutes: 60,
      equipmentRequired: 'Haltères'
    });
    
    expect(form.valid).toBeTruthy();
  });

  it('should get error message for required field', () => {
    const control = component.createProgramForm.get('name');
    control?.markAsTouched();
    control?.setErrors({ required: true });
    
    const errorMessage = component.getErrorMessage('name');
    expect(errorMessage).toBe('Ce champ est requis');
  });

  it('should get error message for min length', () => {
    const control = component.createProgramForm.get('name');
    control?.markAsTouched();
    control?.setErrors({ minlength: { requiredLength: 3 } });
    
    const errorMessage = component.getErrorMessage('name');
    expect(errorMessage).toBe('Minimum 3 caractères');
  });

  it('should get error message for max length', () => {
    const control = component.createProgramForm.get('name');
    control?.markAsTouched();
    control?.setErrors({ maxlength: { requiredLength: 100 } });
    
    const errorMessage = component.getErrorMessage('name');
    expect(errorMessage).toBe('Maximum 100 caractères');
  });

  it('should get error message for min value', () => {
    const control = component.createProgramForm.get('durationWeeks');
    control?.markAsTouched();
    control?.setErrors({ min: { min: 1 } });
    
    const errorMessage = component.getErrorMessage('durationWeeks');
    expect(errorMessage).toBe('La valeur minimale est 1');
  });

  it('should get error message for max value', () => {
    const control = component.createProgramForm.get('durationWeeks');
    control?.markAsTouched();
    control?.setErrors({ max: { max: 52 } });
    
    const errorMessage = component.getErrorMessage('durationWeeks');
    expect(errorMessage).toBe('La valeur maximale est 52');
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
    spyOn(console, 'error');
    component.createProgramForm.patchValue({
      name: 'Test Program',
      description: 'Test Description',
      category: 'Musculation',
      difficultyLevel: 'Débutant',
      targetAudience: 'Tous niveaux',
      durationWeeks: 4,
      sessionsPerWeek: 3,
      estimatedDurationMinutes: 60,
      equipmentRequired: 'Haltères'
    });

    component.onSubmit();

    expect(mockTrainingProgramService.createTrainingProgram).toHaveBeenCalled();
    expect(component.loading).toBeFalsy();
    expect(component.success).toBe('Programme créé avec succès !');
  });

  it('should handle error during form submission', () => {
    spyOn(console, 'error');
    const error = new Error('Test error');
    mockTrainingProgramService.createTrainingProgram.and.returnValue(of().pipe(() => { throw error; }));

    component.createProgramForm.patchValue({
      name: 'Test Program',
      description: 'Test Description',
      category: 'Musculation',
      difficultyLevel: 'Débutant',
      targetAudience: 'Tous niveaux',
      durationWeeks: 4,
      sessionsPerWeek: 3,
      estimatedDurationMinutes: 60,
      equipmentRequired: 'Haltères'
    });

    component.onSubmit();

    expect(component.loading).toBeFalsy();
    expect(component.error).toBe('Erreur lors de la création du programme');
    expect(console.error).toHaveBeenCalled();
  });

  it('should format duration correctly', () => {
    expect(component.formatDuration(30)).toBe('30 minutes');
    expect(component.formatDuration(60)).toBe('1 heure');
    expect(component.formatDuration(90)).toBe('1h30');
    expect(component.formatDuration(120)).toBe('2 heures');
  });

  it('should handle loading state correctly', () => {
    component.loading = true;
    fixture.detectChanges();
    
    const submitButton = fixture.nativeElement.querySelector('.btn-primary');
    expect(submitButton.disabled).toBeTruthy();
    expect(submitButton.textContent).toContain('Création en cours...');
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