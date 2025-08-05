import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CreateProgramComponent } from './create-program.component';
import { TrainingProgramService } from '../../../services/training-program.service';
import { AuthService } from '../../../services/auth.service';
import { HeaderComponent } from '../../../components/header/header.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';

describe('CreateProgramComponent', () => {
  let component: CreateProgramComponent;
  let fixture: ComponentFixture<CreateProgramComponent>;
  let mockTrainingProgramService: jasmine.SpyObj<TrainingProgramService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockCreatedProgram = {
    id: 1,
    name: 'Test Program',
    description: 'Test Description',
    difficultyLevel: 'Débutant',
    category: 'Musculation',
    targetAudience: 'Tous niveaux',
    createdByUserId: 1,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  };

  const mockUser = {
    id: 1,
    email: 'test@test.com',
    name: 'Test User',
    creationDate: '2024-01-01'
  };

  beforeEach(async () => {
    const trainingProgramServiceSpy = jasmine.createSpyObj('TrainingProgramService', ['createTrainingProgram']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getCurrentUser',
      'isAuthenticated',
      'getToken'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      queryParams: of({})
    });

    trainingProgramServiceSpy.createTrainingProgram.and.returnValue(of(mockCreatedProgram));
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);
    authServiceSpy.isAuthenticated.and.returnValue(true);
    authServiceSpy.getToken.and.returnValue('mock-token');

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
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    }).compileComponents();

    mockTrainingProgramService = TestBed.inject(TrainingProgramService) as jasmine.SpyObj<TrainingProgramService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Initialisation du composant', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with default values', () => {
      expect(component.createProgramForm.get('category')?.value).toBe('Musculation');
      expect(component.createProgramForm.get('difficultyLevel')?.value).toBe('Débutant');
      expect(component.createProgramForm.get('targetAudience')?.value).toBe('Tous niveaux');
    });

    it('should create form with required controls', () => {
      expect(component.createProgramForm.get('name')).toBeTruthy();
      expect(component.createProgramForm.get('description')).toBeTruthy();
      expect(component.createProgramForm.get('category')).toBeTruthy();
      expect(component.createProgramForm.get('difficultyLevel')).toBeTruthy();
      expect(component.createProgramForm.get('targetAudience')).toBeTruthy();
    });

    it('should validate required fields', () => {
      const form = component.createProgramForm;
      
      expect(form.valid).toBeFalsy();
      
      form.patchValue({
        name: 'Test Program',
        description: 'Test Description',
        category: 'Musculation',
        difficultyLevel: 'Débutant',
        targetAudience: 'Tous niveaux'
      });
      
      expect(form.valid).toBeTruthy();
    });

    it('should display page title', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Créer un nouveau programme');
    });

    it('should display back button', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Retour aux programmes');
    });

    it('should handle form submission successfully', () => {
      const form = component.createProgramForm;
      form.patchValue({
        name: 'Test Program',
        description: 'Test Description',
        category: 'Musculation',
        difficultyLevel: 'Débutant',
        targetAudience: 'Tous niveaux'
      });

      component.onSubmit();

      expect(mockTrainingProgramService.createProgram).toHaveBeenCalled();
      expect(component.loading).toBe(false);
    });

    it('should handle form submission error', () => {
      mockTrainingProgramService.createProgram.and.returnValue(
        throwError(() => new Error('Erreur de création'))
      );

      const form = component.createProgramForm;
      form.patchValue({
        name: 'Test Program',
        description: 'Test Description',
        category: 'Musculation',
        difficultyLevel: 'Débutant',
        targetAudience: 'Tous niveaux'
      });

      component.onSubmit();

      expect(component.error).toBe('Erreur lors de la création du programme');
      expect(component.loading).toBe(false);
    });

    it('should handle loading state', () => {
      component.loading = true;
      expect(component.loading).toBe(true);
    });

    it('should handle error state', () => {
      component.error = 'Test error';
      expect(component.error).toBe('Test error');
    });

    it('should handle success state', () => {
      component.success = 'Programme créé avec succès';
      expect(component.success).toBe('Programme créé avec succès');
    });

    it('should navigate back to programs', () => {
      component.goBackToPrograms();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/programs']);
    });

    it('should mark form group as touched', () => {
      const form = component.createProgramForm;
      const nameControl = form.get('name');
      
      component.markFormGroupTouched();
      
      expect(nameControl?.touched).toBeTruthy();
    });

    it('should get error message for required field', () => {
      const nameControl = component.createProgramForm.get('name');
      nameControl?.markAsTouched();
      nameControl?.setErrors({ required: true });
      
      const errorMessage = component.getErrorMessage('name');
      expect(errorMessage).toBe('Le nom du programme est requis');
    });

    it('should get error message for minlength field', () => {
      const nameControl = component.createProgramForm.get('name');
      nameControl?.markAsTouched();
      nameControl?.setErrors({ minlength: { requiredLength: 3 } });
      
      const errorMessage = component.getErrorMessage('name');
      expect(errorMessage).toBe('Le nom doit contenir au moins 3 caractères');
    });

    it('should get error message for maxlength field', () => {
      const nameControl = component.createProgramForm.get('name');
      nameControl?.markAsTouched();
      nameControl?.setErrors({ maxlength: { requiredLength: 100 } });
      
      const errorMessage = component.getErrorMessage('name');
      expect(errorMessage).toBe('Le nom ne peut pas dépasser 100 caractères');
    });

    it('should return empty string for untouched field', () => {
      const nameControl = component.createProgramForm.get('name');
      nameControl?.setErrors({ required: true });
      
      const errorMessage = component.getErrorMessage('name');
      expect(errorMessage).toBe('');
    });

    it('should return default error message for unknown error', () => {
      const nameControl = component.createProgramForm.get('name');
      nameControl?.markAsTouched();
      nameControl?.setErrors({ unknown: true });
      
      const errorMessage = component.getErrorMessage('name');
      expect(errorMessage).toBe('Valeur invalide');
    });
  });

  describe('Navigation', () => {
    it('should navigate to you/programs when fromYouPrograms is true', () => {
      component.fromYouPrograms = true;
      
      component.goBackToPrograms();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/you'], { queryParams: { from: 'you-programs' } });
    });

    it('should navigate to programs when fromYouPrograms is false', () => {
      component.fromYouPrograms = false;
      
      component.goBackToPrograms();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/programs']);
    });
  });

  describe('Form validation', () => {
    it('should validate name field', () => {
      const nameControl = component.createProgramForm.get('name');
      
      nameControl?.setValue('');
      expect(nameControl?.invalid).toBeTruthy();
      
      nameControl?.setValue('ab');
      expect(nameControl?.invalid).toBeTruthy();
      
      nameControl?.setValue('Valid Name');
      expect(nameControl?.valid).toBeTruthy();
    });

    it('should validate description field', () => {
      const descriptionControl = component.createProgramForm.get('description');
      
      descriptionControl?.setValue('');
      expect(descriptionControl?.invalid).toBeTruthy();
      
      descriptionControl?.setValue('Short');
      expect(descriptionControl?.invalid).toBeTruthy();
      
      descriptionControl?.setValue('This is a valid description with enough characters');
      expect(descriptionControl?.valid).toBeTruthy();
    });

    it('should validate category field', () => {
      const categoryControl = component.createProgramForm.get('category');
      
      categoryControl?.setValue('');
      expect(categoryControl?.invalid).toBeTruthy();
      
      categoryControl?.setValue('Musculation');
      expect(categoryControl?.valid).toBeTruthy();
    });

    it('should validate difficultyLevel field', () => {
      const difficultyControl = component.createProgramForm.get('difficultyLevel');
      
      difficultyControl?.setValue('');
      expect(difficultyControl?.invalid).toBeTruthy();
      
      difficultyControl?.setValue('Débutant');
      expect(difficultyControl?.valid).toBeTruthy();
    });

    it('should validate targetAudience field', () => {
      const audienceControl = component.createProgramForm.get('targetAudience');
      
      audienceControl?.setValue('');
      expect(audienceControl?.invalid).toBeTruthy();
      
      audienceControl?.setValue('Tous niveaux');
      expect(audienceControl?.valid).toBeTruthy();
    });
  });
}); 