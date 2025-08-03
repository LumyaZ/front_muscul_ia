import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { CreateProgramComponent } from './create-program.component';
import { TrainingProgramService } from '../../../services/training-program.service';
import { AuthService } from '../../../services/auth.service';
import { HeaderComponent } from '../../../components/header/header.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';
import { ActivatedRoute } from '@angular/router';

/**
 * Tests pour le composant CreateProgramComponent
 * Tests for CreateProgramComponent
 */
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
        equipmentRequired: 'Haltères',
        isPublic: true
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
        targetAudience: 'Tous niveaux',
        durationWeeks: 4,
        sessionsPerWeek: 3,
        estimatedDurationMinutes: 60,
        equipmentRequired: 'Haltères',
        isPublic: true
      });

      component.onSubmit();

      expect(mockTrainingProgramService.createTrainingProgram).toHaveBeenCalled();
      expect(component.loading).toBe(false);
    });

    it('should handle form submission error', () => {
      mockTrainingProgramService.createTrainingProgram.and.returnValue(
        throwError(() => new Error('Erreur de création'))
      );

      const form = component.createProgramForm;
      form.patchValue({
        name: 'Test Program',
        description: 'Test Description',
        category: 'Musculation',
        difficultyLevel: 'Débutant',
        targetAudience: 'Tous niveaux',
        durationWeeks: 4,
        sessionsPerWeek: 3,
        estimatedDurationMinutes: 60,
        equipmentRequired: 'Haltères',
        isPublic: true
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

    it('should get error message for invalid duration', () => {
      const durationControl = component.createProgramForm.get('durationWeeks');
      durationControl?.markAsTouched();
      durationControl?.setErrors({ min: { min: 1 } });
      
      const errorMessage = component.getErrorMessage('durationWeeks');
      expect(errorMessage).toBe('La durée doit être d\'au moins 1 semaine(s)');
    });

    it('should format duration correctly', () => {
      expect(component.formatDuration(60)).toBe('1h');
      expect(component.formatDuration(90)).toBe('1h 30min');
      expect(component.formatDuration(30)).toBe('30min');
    });

    it('should validate form when user is not authenticated', () => {
      component.currentUser = null;
      mockAuthService.getCurrentUser.and.returnValue(null);

      const form = component.createProgramForm;
      form.patchValue({
        name: 'Test Program',
        description: 'Test Description',
        category: 'Musculation',
        difficultyLevel: 'Débutant',
        targetAudience: 'Tous niveaux',
        durationWeeks: 4,
        sessionsPerWeek: 3,
        estimatedDurationMinutes: 60,
        equipmentRequired: 'Haltères',
        isPublic: true
      });

      component.onSubmit();

      expect(mockAuthService.getCurrentUser).toHaveBeenCalled();
      expect(mockTrainingProgramService.createTrainingProgram).not.toHaveBeenCalled();
    });

    it('should display form sections correctly', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      
      expect(compiled.textContent).toContain('Informations de base');
      expect(compiled.textContent).toContain('Niveau et public cible');
      expect(compiled.textContent).toContain('Durée et fréquence');
      expect(compiled.textContent).toContain('Équipement et visibilité');
    });

    it('should display all form fields', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      
      expect(compiled.textContent).toContain('Nom du programme');
      expect(compiled.textContent).toContain('Catégorie');
      expect(compiled.textContent).toContain('Description');
      expect(compiled.textContent).toContain('Niveau de difficulté');
      expect(compiled.textContent).toContain('Public cible');
      expect(compiled.textContent).toContain('Durée (semaines)');
      expect(compiled.textContent).toContain('Sessions par semaine');
      expect(compiled.textContent).toContain('Durée estimée par session (minutes)');
      expect(compiled.textContent).toContain('Équipement requis');
    });
  });
}); 