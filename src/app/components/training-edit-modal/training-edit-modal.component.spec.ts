import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { TrainingEditModalComponent, TrainingCategory } from './training-edit-modal.component';
import { TrainingInfoService } from '../../services/training-info.service';
import { TrainingInfo, Gender, ExperienceLevel, SessionFrequency, SessionDuration, MainGoal, TrainingPreference, Equipment } from '../../models/training-info.model';

/**
 * Unit tests for TrainingEditModalComponent.
 * Tests unitaires pour TrainingEditModalComponent.
 */
describe('TrainingEditModalComponent', () => {
  let component: TrainingEditModalComponent;
  let fixture: ComponentFixture<TrainingEditModalComponent>;
  let trainingInfoService: jasmine.SpyObj<TrainingInfoService>;

  const mockTrainingInfo: TrainingInfo = {
    id: 1,
    userId: 1,
    gender: Gender.MALE,
    weight: 75,
    height: 180,
    bodyFatPercentage: 15,
    experienceLevel: ExperienceLevel.INTERMEDIATE,
    sessionFrequency: SessionFrequency.THREE_TO_FOUR,
    sessionDuration: SessionDuration.MEDIUM,
    mainGoal: MainGoal.MUSCLE_GAIN,
    trainingPreference: TrainingPreference.STRENGTH_TRAINING,
    equipment: Equipment.GYM_ACCESS,
    bmi: 23.1
  };

  beforeEach(async () => {
    const trainingInfoServiceSpy = jasmine.createSpyObj('TrainingInfoService', ['updateTrainingInfo']);

    await TestBed.configureTestingModule({
      imports: [
        TrainingEditModalComponent,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: TrainingInfoService, useValue: trainingInfoServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingEditModalComponent);
    component = fixture.componentInstance;
    trainingInfoService = TestBed.inject(TrainingInfoService) as jasmine.SpyObj<TrainingInfoService>;
  });

  /**
   * Test de création du composant
   * Test component creation
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test d'initialisation et configuration
   * Test initialization and configuration
   */
  describe('Initialization and Configuration', () => {
    it('should initialize forms for all categories correctly', () => {
      const categories: TrainingCategory[] = ['personal', 'experience', 'goals', 'equipment'];
      
      categories.forEach(category => {
        component.category = category;
        component.ngOnInit();
        
        expect(component.editForm).toBeDefined();
        
        switch (category) {
          case 'personal':
            expect(component.editForm.get('gender')).toBeDefined();
            expect(component.editForm.get('weight')).toBeDefined();
            expect(component.editForm.get('height')).toBeDefined();
            expect(component.editForm.get('bodyFatPercentage')).toBeDefined();
            break;
          case 'experience':
            expect(component.editForm.get('experienceLevel')).toBeDefined();
            expect(component.editForm.get('sessionFrequency')).toBeDefined();
            expect(component.editForm.get('sessionDuration')).toBeDefined();
            break;
          case 'goals':
            expect(component.editForm.get('mainGoal')).toBeDefined();
            expect(component.editForm.get('trainingPreference')).toBeDefined();
            break;
          case 'equipment':
            expect(component.editForm.get('equipment')).toBeDefined();
            break;
        }
      });
    });

    it('should load current training data when modal opens', () => {
      component.currentTrainingInfo = mockTrainingInfo;
      component.category = 'personal';

      component.ngOnInit();
      component.loadCurrentData();

      expect(component.editForm.get('gender')?.value).toBe(Gender.MALE);
      expect(component.editForm.get('weight')?.value).toBe(75);
      expect(component.editForm.get('height')?.value).toBe(180);
      expect(component.editForm.get('bodyFatPercentage')?.value).toBe(15);
    });
  });

  /**
   * Test de validation des formulaires
   * Test form validation
   */
  describe('Form Validation', () => {
    beforeEach(() => {
      component.category = 'personal';
      component.ngOnInit();
    });

    it('should validate required fields and constraints', () => {
      const form = component.editForm;
      
      expect(form.valid).toBeFalsy();
      expect(form.get('gender')?.errors?.['required']).toBeTruthy();
      expect(form.get('weight')?.errors?.['required']).toBeTruthy();
      expect(form.get('height')?.errors?.['required']).toBeTruthy();

      const weightControl = form.get('weight');
      weightControl?.setValue(25);
      expect(weightControl?.errors?.['min']).toBeTruthy();
      weightControl?.setValue(350);
      expect(weightControl?.errors?.['max']).toBeTruthy();
      weightControl?.setValue('invalid');
      expect(weightControl?.errors?.['invalidNumber']).toBeTruthy();

      const heightControl = form.get('height');
      heightControl?.setValue(80);
      expect(heightControl?.errors?.['min']).toBeTruthy();
      heightControl?.setValue(280);
      expect(heightControl?.errors?.['max']).toBeTruthy();

      const bodyFatControl = form.get('bodyFatPercentage');
      bodyFatControl?.setValue(2);
      expect(bodyFatControl?.errors?.['min']).toBeTruthy();
      bodyFatControl?.setValue(55);
      expect(bodyFatControl?.errors?.['max']).toBeTruthy();
    });

    it('should validate form with valid data', () => {
      component.editForm.patchValue({
        gender: Gender.MALE,
        weight: 75,
        height: 180,
        bodyFatPercentage: 15
      });
      
      expect(component.editForm.valid).toBeTruthy();
    });
  });

  /**
   * Test des méthodes utilitaires
   * Test utility methods
   */
  describe('Utility Methods', () => {
    it('should get category information correctly', () => {
      const testCases = [
        { category: 'personal', title: 'Informations personnelles', icon: 'fas fa-user-circle' },
        { category: 'experience', title: 'Expérience d\'entraînement', icon: 'fas fa-chart-line' },
        { category: 'goals', title: 'Objectifs et préférences', icon: 'fas fa-bullseye' },
        { category: 'equipment', title: 'Équipement', icon: 'fas fa-tools' }
      ];

      testCases.forEach(({ category, title, icon }) => {
        component.category = category as TrainingCategory;
        expect(component.getCategoryTitle()).toBe(title);
        expect(component.getCategoryIcon()).toBe(icon);
      });
    });

    it('should handle field validation and error messages', () => {
      component.category = 'personal';
      component.ngOnInit();
      
      const weightControl = component.editForm.get('weight');
      weightControl?.setValue(25);
      weightControl?.markAsTouched();
      
      expect(component.isFieldInvalid('weight')).toBeTruthy();
      expect(component.isFieldInvalid('height')).toBeFalsy();
      expect(component.getFieldErrorMessage('weight')).toContain('minimale est 30');
    });

    it('should get display name correctly', () => {
      const displayNames = { 'TEST': 'Test Display' };
      expect(component.getDisplayName('TEST', displayNames)).toBe('Test Display');
      expect(component.getDisplayName('UNKNOWN', displayNames)).toBe('UNKNOWN');
    });
  });

  /**
   * Test des interactions utilisateur
   * Test user interactions
   */
  describe('User Interactions', () => {
    beforeEach(() => {
      component.category = 'personal';
      component.ngOnInit();
    });

    it('should handle option selection and field changes', () => {
      component.selectOption('gender', Gender.FEMALE);
      expect(component.editForm.get('gender')?.value).toBe(Gender.FEMALE);

      component.error = 'Test error';
      component.onFieldChange();
      expect(component.error).toBeNull();
    });
  });

  /**
   * Test de soumission du formulaire
   * Test form submission
   */
  describe('Form Submission', () => {
    beforeEach(() => {
      component.category = 'personal';
      component.currentTrainingInfo = mockTrainingInfo;
      component.ngOnInit();
    });

    it('should submit form successfully with valid data', () => {
      const updatedTrainingInfo = { ...mockTrainingInfo, weight: 80 };
      trainingInfoService.updateTrainingInfo.and.returnValue(of(updatedTrainingInfo));
      spyOn(component.trainingUpdated, 'emit');
      spyOn(component.closeModal, 'emit');
      
      component.editForm.patchValue({
        gender: Gender.MALE,
        weight: 80,
        height: 180,
        bodyFatPercentage: 15
      });

      component.onSubmit();

      expect(trainingInfoService.updateTrainingInfo).toHaveBeenCalled();
      expect(component.trainingUpdated.emit).toHaveBeenCalledWith(updatedTrainingInfo);
      expect(component.closeModal.emit).toHaveBeenCalled();
      expect(component.isLoading).toBeFalsy();
    });

    it('should not submit form with invalid data', () => {
      component.editForm.patchValue({
        gender: '',
        weight: 25, 
        height: 180,
        bodyFatPercentage: 15
      });

      component.onSubmit();

      expect(trainingInfoService.updateTrainingInfo).not.toHaveBeenCalled();
    });

    it('should handle various error scenarios', () => {
      const errorScenarios = [
        { status: 400, expectedMessage: 'vérifier les informations saisies' },
        { status: 401, expectedMessage: 'Session expirée' },
        { status: 403, expectedMessage: 'permissions' },
        { status: 404, expectedMessage: 'non trouvées' },
        { status: 0, expectedMessage: 'Impossible de se connecter au serveur' }
      ];

      errorScenarios.forEach(({ status, expectedMessage }) => {
        trainingInfoService.updateTrainingInfo.and.returnValue(throwError(() => ({ status })));
        
        component.editForm.patchValue({
          gender: Gender.MALE,
          weight: 75,
          height: 180,
          bodyFatPercentage: 15
        });

        component.onSubmit();

        expect(component.error).toContain(expectedMessage);
        expect(component.isLoading).toBeFalsy();
      });
    });
  });

  /**
   * Test de gestion de la modale
   * Test modal management
   */
  describe('Modal Management', () => {
    it('should handle modal interactions correctly', () => {
      spyOn(component.closeModal, 'emit');
      component.onClose();
      expect(component.closeModal.emit).toHaveBeenCalled();

      const mockEvent = {
        target: document.createElement('div'),
        currentTarget: document.createElement('div')
      };
      component.onBackdropClick(mockEvent as any);
      expect(component.closeModal.emit).toHaveBeenCalledTimes(1);
    });

    it('should manage body scroll correctly', () => {
      component.isOpen = true;
      spyOn(document.body.classList, 'add');
      component.ngOnChanges();
      expect(document.body.style.overflow).toBe('hidden');
      expect(document.body.classList.add).toHaveBeenCalledWith('modal-open');

      component.isOpen = false;
      spyOn(document.body.classList, 'remove');
      component.ngOnChanges();
      expect(document.body.classList.remove).toHaveBeenCalledWith('modal-open');

      component.ngOnDestroy();
      expect(document.body.classList.remove).toHaveBeenCalledWith('modal-open');
    });
  });
}); 