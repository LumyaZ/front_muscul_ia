import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { TrainingInfoFormComponent } from './training-info-form.component';
import { TrainingInfoService } from '../../services/training-info.service';
import { Gender, ExperienceLevel, SessionFrequency, SessionDuration, MainGoal, TrainingPreference, Equipment } from '../../models/training-info.model';
import { Router, ActivatedRoute } from '@angular/router';

/**
 * Unit tests for TrainingInfoFormComponent.
 * Tests unitaires pour TrainingInfoFormComponent.
 */
describe('TrainingInfoFormComponent', () => {
  let component: TrainingInfoFormComponent;
  let fixture: ComponentFixture<TrainingInfoFormComponent>;
  let mockTrainingInfoService: jasmine.SpyObj<TrainingInfoService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockTrainingInfo = {
    id: 1,
    userId: 1,
    gender: Gender.MALE,
    weight: 75.0,
    height: 180.0,
    bodyFatPercentage: 15.0,
    experienceLevel: ExperienceLevel.INTERMEDIATE,
    sessionFrequency: SessionFrequency.THREE_TO_FOUR,
    sessionDuration: SessionDuration.MEDIUM,
    mainGoal: MainGoal.MUSCLE_GAIN,
    trainingPreference: TrainingPreference.STRENGTH_TRAINING,
    equipment: Equipment.GYM_ACCESS,
    bmi: 23.15,
    createdAt: '2023-01-01T00:00:00',
    updatedAt: '2023-01-01T00:00:00'
  };

  beforeEach(async () => {
    const trainingInfoServiceSpy = jasmine.createSpyObj('TrainingInfoService', [
      'existsTrainingInfo', 
      'getTrainingInfo', 
      'createTrainingInfo', 
      'updateTrainingInfo'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      params: of({}),
      queryParams: of({})
    });

    trainingInfoServiceSpy.existsTrainingInfo.and.returnValue(of(false));
    trainingInfoServiceSpy.getTrainingInfo.and.returnValue(of(mockTrainingInfo));
    trainingInfoServiceSpy.createTrainingInfo.and.returnValue(of(mockTrainingInfo));
    trainingInfoServiceSpy.updateTrainingInfo.and.returnValue(of(mockTrainingInfo));

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'auth_token') {
        return 'mock-token';
      }
      if (key === 'current_user') {
        return JSON.stringify({ id: 1, username: 'testuser' });
      }
      return null;
    });

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: 'dashboard', component: {} as any },
          { path: 'login', component: {} as any },
          { path: 'training-info', component: TrainingInfoFormComponent }
        ]),
        HttpClientTestingModule,
        TrainingInfoFormComponent
      ],
      providers: [
        { provide: TrainingInfoService, useValue: trainingInfoServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingInfoFormComponent);
    component = fixture.componentInstance;
    mockTrainingInfoService = TestBed.inject(TrainingInfoService) as jasmine.SpyObj<TrainingInfoService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  /**
   * Test de création du composant
   * Test component creation
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test que le formulaire est invalide à l'initialisation
   * Test that form is invalid initially
   */
  it('should have an invalid form initially', () => {
    expect(component.trainingInfoForm.valid).toBeFalsy();
  });

  /**
   * Test que le formulaire est valide avec des données correctes
   * Test that form is valid with correct data
   */
  it('should have a valid form with correct data', () => {
    component.trainingInfoForm.patchValue({
      gender: Gender.MALE,
      weight: 75.0,
      height: 180.0,
      bodyFatPercentage: 15.0,
      experienceLevel: ExperienceLevel.INTERMEDIATE,
      sessionFrequency: SessionFrequency.THREE_TO_FOUR,
      sessionDuration: SessionDuration.MEDIUM,
      mainGoal: MainGoal.MUSCLE_GAIN,
      trainingPreference: TrainingPreference.STRENGTH_TRAINING,
      equipment: Equipment.GYM_ACCESS
    });
    expect(component.trainingInfoForm.valid).toBeTruthy();
  });

  /**
   * Test d'initialisation du formulaire avec les validateurs requis
   * Test form initialization with required validators
   */
  it('should initialize form with required validators', () => {
    expect(component.trainingInfoForm.get('gender')?.hasError('required')).toBeTruthy();
    expect(component.trainingInfoForm.get('weight')?.hasError('required')).toBeTruthy();
    expect(component.trainingInfoForm.get('height')?.hasError('required')).toBeTruthy();
    expect(component.trainingInfoForm.get('experienceLevel')?.hasError('required')).toBeTruthy();
    expect(component.trainingInfoForm.get('sessionFrequency')?.hasError('required')).toBeTruthy();
    expect(component.trainingInfoForm.get('sessionDuration')?.hasError('required')).toBeTruthy();
    expect(component.trainingInfoForm.get('mainGoal')?.hasError('required')).toBeTruthy();
    expect(component.trainingInfoForm.get('trainingPreference')?.hasError('required')).toBeTruthy();
    expect(component.trainingInfoForm.get('equipment')?.hasError('required')).toBeTruthy();
  });

  /**
   * Test de validation des limites pour le poids
   * Test weight limits validation
   */
  it('should validate weight limits', () => {
    const weightControl = component.trainingInfoForm.get('weight');
    
    weightControl?.setValue(25);
    expect(weightControl?.errors?.['min']).toBeTruthy();
    
    weightControl?.setValue(350);
    expect(weightControl?.errors?.['max']).toBeTruthy();
    
    weightControl?.setValue(75);
    expect(weightControl?.errors).toBeNull();
  });

  /**
   * Test de validation des limites pour la taille
   * Test height limits validation
   */
  it('should validate height limits', () => {
    const heightControl = component.trainingInfoForm.get('height');
    
    heightControl?.setValue(80);
    expect(heightControl?.errors?.['min']).toBeTruthy();
    
    heightControl?.setValue(280);
    expect(heightControl?.errors?.['max']).toBeTruthy();
    
    heightControl?.setValue(180);
    expect(heightControl?.errors).toBeNull();
  });

  /**
   * Test de validation des limites pour le pourcentage de graisse corporelle
   * Test body fat percentage limits validation
   */
  it('should validate body fat percentage limits', () => {
    const bodyFatControl = component.trainingInfoForm.get('bodyFatPercentage');
    
    bodyFatControl?.setValue(2);
    expect(bodyFatControl?.errors?.['min']).toBeTruthy();
    
    bodyFatControl?.setValue(55);
    expect(bodyFatControl?.errors?.['max']).toBeTruthy();
    
    bodyFatControl?.setValue(15);
    expect(bodyFatControl?.errors).toBeNull();
  });

  /**
   * Test de vérification des informations d'entraînement existantes
   * Test checking existing training info
   */
  it('should check existing training info on init', () => {
    mockTrainingInfoService.existsTrainingInfo.and.returnValue(of(false));
    
    component.ngOnInit();
    
    expect(mockTrainingInfoService.existsTrainingInfo).toHaveBeenCalled();
    expect(component.isEditMode).toBeFalse();
  });

  /**
   * Test de chargement des informations d'entraînement existantes en mode édition
   * Test loading existing training info in edit mode
   */
  it('should load existing training info when in edit mode', () => {
    mockTrainingInfoService.existsTrainingInfo.and.returnValue(of(true));
    mockTrainingInfoService.getTrainingInfo.and.returnValue(of(mockTrainingInfo));
    
    component.ngOnInit();
    
    expect(component.isEditMode).toBeTrue();
    expect(mockTrainingInfoService.getTrainingInfo).toHaveBeenCalled();
    expect(component.existingTrainingInfo).toEqual(mockTrainingInfo);
  });

  /**
   * Test de création d'informations d'entraînement avec succès
   * Test successful training info creation
   */
  it('should create training info successfully', () => {
    mockTrainingInfoService.existsTrainingInfo.and.returnValue(of(false));
    mockTrainingInfoService.createTrainingInfo.and.returnValue(of(mockTrainingInfo));
    
    component.ngOnInit();
    
    component.trainingInfoForm.patchValue({
      gender: Gender.MALE,
      weight: 75.0,
      height: 180.0,
      bodyFatPercentage: 15.0,
      experienceLevel: ExperienceLevel.INTERMEDIATE,
      sessionFrequency: SessionFrequency.THREE_TO_FOUR,
      sessionDuration: SessionDuration.MEDIUM,
      mainGoal: MainGoal.MUSCLE_GAIN,
      trainingPreference: TrainingPreference.STRENGTH_TRAINING,
      equipment: Equipment.GYM_ACCESS
    });
    
    component.onSubmit();
    
    expect(mockTrainingInfoService.createTrainingInfo).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  /**
   * Test de mise à jour d'informations d'entraînement avec succès
   * Test successful training info update
   */
  it('should update training info successfully', () => {
    mockTrainingInfoService.existsTrainingInfo.and.returnValue(of(true));
    mockTrainingInfoService.getTrainingInfo.and.returnValue(of(mockTrainingInfo));
    mockTrainingInfoService.updateTrainingInfo.and.returnValue(of(mockTrainingInfo));
    
    component.ngOnInit();
    
    component.trainingInfoForm.patchValue({
      gender: Gender.MALE,
      weight: 80.0,
      height: 182.0,
      bodyFatPercentage: 16.0,
      experienceLevel: ExperienceLevel.INTERMEDIATE,
      sessionFrequency: SessionFrequency.THREE_TO_FOUR,
      sessionDuration: SessionDuration.MEDIUM,
      mainGoal: MainGoal.MUSCLE_GAIN,
      trainingPreference: TrainingPreference.STRENGTH_TRAINING,
      equipment: Equipment.GYM_ACCESS
    });
    
    component.onSubmit();
    
    expect(mockTrainingInfoService.updateTrainingInfo).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  /**
   * Test de gestion d'erreur lors de la création
   * Test error handling during creation
   */
  it('should handle error when creating training info', () => {
    mockTrainingInfoService.existsTrainingInfo.and.returnValue(of(false));
    mockTrainingInfoService.createTrainingInfo.and.returnValue(throwError(() => ({ 
      status: 422, 
      error: { message: 'Données invalides' } 
    })));
    
    component.ngOnInit();
    
    component.trainingInfoForm.patchValue({
      gender: Gender.MALE,
      weight: 75.0,
      height: 180.0,
      experienceLevel: ExperienceLevel.INTERMEDIATE,
      sessionFrequency: SessionFrequency.THREE_TO_FOUR,
      sessionDuration: SessionDuration.MEDIUM,
      mainGoal: MainGoal.MUSCLE_GAIN,
      trainingPreference: TrainingPreference.STRENGTH_TRAINING,
      equipment: Equipment.GYM_ACCESS
    });
    
    component.onSubmit();
    
    expect(component.error).toBe('Données invalides. Veuillez vérifier vos informations.');
    expect(component.isLoading).toBeFalse();
  });

  /**
   * Test de gestion d'erreur lors de la mise à jour
   * Test error handling during update
   */
  it('should handle error when updating training info', () => {
    mockTrainingInfoService.existsTrainingInfo.and.returnValue(of(true));
    mockTrainingInfoService.getTrainingInfo.and.returnValue(of(mockTrainingInfo));
    mockTrainingInfoService.updateTrainingInfo.and.returnValue(throwError(() => ({ 
      status: 404, 
      error: { message: 'Informations non trouvées' } 
    })));
    
    component.ngOnInit();
    
    component.trainingInfoForm.patchValue({
      gender: Gender.MALE,
      weight: 80.0,
      height: 182.0,
      experienceLevel: ExperienceLevel.INTERMEDIATE,
      sessionFrequency: SessionFrequency.THREE_TO_FOUR,
      sessionDuration: SessionDuration.MEDIUM,
      mainGoal: MainGoal.MUSCLE_GAIN,
      trainingPreference: TrainingPreference.STRENGTH_TRAINING,
      equipment: Equipment.GYM_ACCESS
    });
    
    component.onSubmit();
    
    expect(component.error).toBe('Informations d\'entraînement non trouvées.');
    expect(component.isLoading).toBeFalse();
  });

  /**
   * Test que le service n'est pas appelé quand le formulaire est invalide
   * Test that service is not called when form is invalid
   */
  it('should not submit if form is invalid', () => {
    mockTrainingInfoService.createTrainingInfo.calls.reset();
    
    component.onSubmit();
    
    expect(mockTrainingInfoService.createTrainingInfo).not.toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  });

  /**
   * Test de récupération du nom d'affichage correct
   * Test getting correct display name
   */
  it('should get display name correctly', () => {
    const displayNames = { 'TEST': 'Test Display' };
    const result = component.getDisplayName('TEST', displayNames);
    expect(result).toBe('Test Display');
  });

  /**
   * Test de retour de la valeur d'énumération si le nom d'affichage n'est pas trouvé
   * Test returning enum value if display name not found
   */
  it('should return enum value if display name not found', () => {
    const displayNames = { 'TEST': 'Test Display' };
    const result = component.getDisplayName('UNKNOWN', displayNames);
    expect(result).toBe('UNKNOWN');
  });

  /**
   * Test de sélection d'option
   * Test option selection
   */
  it('should select option correctly', () => {
    const field = 'gender';
    const value = Gender.MALE;
    
    component.selectOption(field, value);
    
    expect(component.trainingInfoForm.get(field)?.value).toBe(value);
    expect(component.trainingInfoForm.get(field)?.touched).toBeTrue();
  });

  /**
   * Test de navigation vers l'étape suivante
   * Test navigation to next step
   */
  it('should navigate to next step when current step is valid', () => {
    component.currentStep = 1;
    component.trainingInfoForm.patchValue({
      gender: Gender.MALE,
      weight: 75.0,
      height: 180.0
    });
    
    component.nextStep();
    
    expect(component.currentStep).toBe(2);
  });

  /**
   * Test de navigation vers l'étape précédente
   * Test navigation to previous step
   */
  it('should navigate to previous step', () => {
    component.currentStep = 2;
    
    component.previousStep();
    
    expect(component.currentStep).toBe(1);
  });

  /**
   * Test de validation d'étape
   * Test step validation
   */
  it('should validate steps correctly', () => {
    component.trainingInfoForm.patchValue({
      gender: Gender.MALE,
      weight: 75.0,
      height: 180.0
    });
    expect(component.isStepValid(1)).toBeTrue();
    
    component.trainingInfoForm.patchValue({
      experienceLevel: ExperienceLevel.INTERMEDIATE,
      sessionFrequency: SessionFrequency.THREE_TO_FOUR,
      sessionDuration: SessionDuration.MEDIUM
    });
    expect(component.isStepValid(2)).toBeTrue();
    
    component.trainingInfoForm.patchValue({
      mainGoal: MainGoal.MUSCLE_GAIN,
      trainingPreference: TrainingPreference.STRENGTH_TRAINING
    });
    expect(component.isStepValid(3)).toBeTrue();
    
    component.trainingInfoForm.patchValue({
      equipment: Equipment.GYM_ACCESS
    });
    expect(component.isStepValid(4)).toBeTrue();
  });

  /**
   * Test de validation de champ invalide
   * Test invalid field validation
   */
  it('should check if field is invalid', () => {
    const field = 'weight';
    const control = component.trainingInfoForm.get(field);
    
    expect(component.isFieldInvalid(field)).toBeFalse();
    
    control?.markAsTouched();
    control?.setValue(75);
    expect(component.isFieldInvalid(field)).toBeFalse();
    
    control?.setValue('');
    expect(component.isFieldInvalid(field)).toBeTrue();
  });

  /**
   * Test de gestion d'erreur 401 (session expirée)
   * Test handling 401 error (expired session)
   */
  it('should handle 401 error correctly', () => {
    mockTrainingInfoService.existsTrainingInfo.and.returnValue(throwError(() => ({ status: 401 })));
    
    component.ngOnInit();
    
    expect(component.error).toBe('Session expirée. Veuillez vous reconnecter.');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  /**
   * Test de gestion d'erreur 403 (accès refusé)
   * Test handling 403 error (access denied)
   */
  it('should handle 403 error correctly', () => {
    mockTrainingInfoService.existsTrainingInfo.and.returnValue(throwError(() => ({ status: 403 })));
    
    component.ngOnInit();
    
    expect(component.error).toBe('Accès refusé. Vous n\'avez pas les permissions nécessaires.');
  });

  /**
   * Test de gestion d'erreur 0 (problème de connexion)
   * Test handling 0 error (connection issue)
   */
  it('should handle 0 error correctly', () => {
    mockTrainingInfoService.existsTrainingInfo.and.returnValue(throwError(() => ({ status: 0 })));
    
    component.ngOnInit();
    
    expect(component.error).toBe('Impossible de se connecter au serveur. Vérifiez votre connexion.');
  });

  /**
   * Test de gestion d'erreur générique
   * Test handling generic error
   */
  it('should handle generic error correctly', () => {
    mockTrainingInfoService.existsTrainingInfo.and.returnValue(throwError(() => ({ status: 500 })));
    
    component.ngOnInit();
    
    expect(component.error).toBe('Une erreur est survenue. Veuillez réessayer.');
  });

  /**
   * Test d'effacement du message d'erreur lors du changement de champ
   * Test clearing error message on field change
   */
  it('should clear error message on field change', () => {
    component.error = 'Test error';
    
    component.onFieldChange();
    
    expect(component.error).toBeNull();
  });

  /**
   * Test de récupération de la date maximale
   * Test getting max date
   */
  it('should get max date correctly', () => {
    const maxDate = component.getMaxDate();
    const today = new Date().toISOString().split('T')[0];
    
    expect(maxDate).toBe(today);
  });
}); 