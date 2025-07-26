import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { TrainingEditModalComponent, TrainingCategory } from './training-edit-modal.component';
import { TrainingInfoService } from '../../services/training-info.service';
import { TrainingInfo, Gender, ExperienceLevel, SessionFrequency, SessionDuration, MainGoal, TrainingPreference, Equipment } from '../../models/training-info.model';

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test component initialization.
   * Test d'initialisation du composant.
   */
  describe('Initialization', () => {
    it('should initialize form on init', () => {
      // Given
      component.category = 'personal';

      // When
      component.ngOnInit();

      // Then
      expect(component.editForm).toBeDefined();
      expect(component.editForm.get('gender')).toBeDefined();
      expect(component.editForm.get('weight')).toBeDefined();
      expect(component.editForm.get('height')).toBeDefined();
    });

    it('should initialize personal category form', () => {
      // Given
      component.category = 'personal';

      // When
      component.ngOnInit();

      // Then
      expect(component.editForm.get('gender')).toBeDefined();
      expect(component.editForm.get('weight')).toBeDefined();
      expect(component.editForm.get('height')).toBeDefined();
      expect(component.editForm.get('bodyFatPercentage')).toBeDefined();
    });

    it('should initialize experience category form', () => {
      // Given
      component.category = 'experience';

      // When
      component.ngOnInit();

      // Then
      expect(component.editForm.get('experienceLevel')).toBeDefined();
      expect(component.editForm.get('sessionFrequency')).toBeDefined();
      expect(component.editForm.get('sessionDuration')).toBeDefined();
    });

    it('should initialize goals category form', () => {
      // Given
      component.category = 'goals';

      // When
      component.ngOnInit();

      // Then
      expect(component.editForm.get('mainGoal')).toBeDefined();
      expect(component.editForm.get('trainingPreference')).toBeDefined();
    });

    it('should initialize equipment category form', () => {
      // Given
      component.category = 'equipment';

      // When
      component.ngOnInit();

      // Then
      expect(component.editForm.get('equipment')).toBeDefined();
    });
  });

  /**
   * Test data loading.
   * Test de chargement des données.
   */
  describe('Data Loading', () => {
    it('should load personal data into form', () => {
      // Given
      component.category = 'personal';
      component.currentTrainingInfo = mockTrainingInfo;

      // When
      component.ngOnInit();
      component.loadCurrentData();

      // Then
      expect(component.editForm.get('gender')?.value).toBe(Gender.MALE);
      expect(component.editForm.get('weight')?.value).toBe(75);
      expect(component.editForm.get('height')?.value).toBe(180);
      expect(component.editForm.get('bodyFatPercentage')?.value).toBe(15);
    });

    it('should load experience data into form', () => {
      // Given
      component.category = 'experience';
      component.currentTrainingInfo = mockTrainingInfo;

      // When
      component.ngOnInit();
      component.loadCurrentData();

      // Then
      expect(component.editForm.get('experienceLevel')?.value).toBe(ExperienceLevel.INTERMEDIATE);
      expect(component.editForm.get('sessionFrequency')?.value).toBe(SessionFrequency.THREE_TO_FOUR);
      expect(component.editForm.get('sessionDuration')?.value).toBe(SessionDuration.MEDIUM);
    });

    it('should load goals data into form', () => {
      // Given
      component.category = 'goals';
      component.currentTrainingInfo = mockTrainingInfo;

      // When
      component.ngOnInit();
      component.loadCurrentData();

      // Then
      expect(component.editForm.get('mainGoal')?.value).toBe(MainGoal.MUSCLE_GAIN);
      expect(component.editForm.get('trainingPreference')?.value).toBe(TrainingPreference.STRENGTH_TRAINING);
    });

    it('should load equipment data into form', () => {
      // Given
      component.category = 'equipment';
      component.currentTrainingInfo = mockTrainingInfo;

      // When
      component.ngOnInit();
      component.loadCurrentData();

      // Then
      expect(component.editForm.get('equipment')?.value).toBe(Equipment.GYM_ACCESS);
    });
  });

  /**
   * Test category titles and icons.
   * Test des titres et icônes de catégories.
   */
  describe('Category Information', () => {
    it('should return correct title for personal category', () => {
      // Given
      component.category = 'personal';

      // When
      const title = component.getCategoryTitle();

      // Then
      expect(title).toBe('Informations personnelles');
    });

    it('should return correct title for experience category', () => {
      // Given
      component.category = 'experience';

      // When
      const title = component.getCategoryTitle();

      // Then
      expect(title).toBe('Expérience d\'entraînement');
    });

    it('should return correct title for goals category', () => {
      // Given
      component.category = 'goals';

      // When
      const title = component.getCategoryTitle();

      // Then
      expect(title).toBe('Objectifs et préférences');
    });

    it('should return correct title for equipment category', () => {
      // Given
      component.category = 'equipment';

      // When
      const title = component.getCategoryTitle();

      // Then
      expect(title).toBe('Équipement');
    });

    it('should return correct icon for personal category', () => {
      // Given
      component.category = 'personal';

      // When
      const icon = component.getCategoryIcon();

      // Then
      expect(icon).toBe('fas fa-user-circle');
    });

    it('should return correct icon for experience category', () => {
      // Given
      component.category = 'experience';

      // When
      const icon = component.getCategoryIcon();

      // Then
      expect(icon).toBe('fas fa-chart-line');
    });
  });

  /**
   * Test form interactions.
   * Test des interactions avec le formulaire.
   */
  describe('Form Interactions', () => {
    it('should select option correctly', () => {
      // Given
      component.category = 'personal';
      component.ngOnInit();

      // When
      component.selectOption('gender', Gender.FEMALE);

      // Then
      expect(component.editForm.get('gender')?.value).toBe(Gender.FEMALE);
    });

    it('should get display name correctly', () => {
      // When
      const result = component.getDisplayName(Gender.MALE, component.genderDisplayNames);

      // Then
      expect(result).toBe('Homme');
    });

    it('should return original value if no display name found', () => {
      // When
      const result = component.getDisplayName('UNKNOWN', component.genderDisplayNames);

      // Then
      expect(result).toBe('UNKNOWN');
    });
  });

  /**
   * Test form submission.
   * Test de soumission du formulaire.
   */
  describe('Form Submission', () => {
    it('should submit personal form successfully', () => {
      // Given
      component.category = 'personal';
      component.currentTrainingInfo = mockTrainingInfo;
      const updatedTrainingInfo = { ...mockTrainingInfo, weight: 80 };
      trainingInfoService.updateTrainingInfo.and.returnValue(of(updatedTrainingInfo));
      spyOn(component.trainingUpdated, 'emit');
      spyOn(component.closeModal, 'emit');

      component.ngOnInit();
      component.loadCurrentData();
      component.editForm.patchValue({ weight: 80 });

      // When
      component.onSubmit();

      // Then
      expect(trainingInfoService.updateTrainingInfo).toHaveBeenCalled();
      expect(component.trainingUpdated.emit).toHaveBeenCalledWith(updatedTrainingInfo);
      expect(component.closeModal.emit).toHaveBeenCalled();
      expect(component.isLoading).toBeFalse();
    });

    it('should handle submission error', () => {
      // Given
      component.category = 'personal';
      component.currentTrainingInfo = mockTrainingInfo;
      trainingInfoService.updateTrainingInfo.and.returnValue(throwError(() => new Error('Update failed')));

      component.ngOnInit();
      component.loadCurrentData();

      // When
      component.onSubmit();

      // Then
      expect(component.error).toBe('Erreur lors de la mise à jour des informations d\'entraînement');
      expect(component.isLoading).toBeFalse();
    });

    it('should not submit if form is invalid', () => {
      // Given
      component.category = 'personal';
      component.currentTrainingInfo = mockTrainingInfo;

      component.ngOnInit();
      component.editForm.patchValue({ weight: null }); // Invalid value

      // When
      component.onSubmit();

      // Then
      expect(trainingInfoService.updateTrainingInfo).not.toHaveBeenCalled();
    });
  });

  /**
   * Test modal interactions.
   * Test des interactions avec la modale.
   */
  describe('Modal Interactions', () => {
    it('should close modal', () => {
      // Given
      spyOn(component.closeModal, 'emit');

      // When
      component.onClose();

      // Then
      expect(component.closeModal.emit).toHaveBeenCalled();
    });

    it('should handle backdrop click', () => {
      // Given
      spyOn(component, 'onClose');
      const event = new Event('click');
      Object.defineProperty(event, 'target', { value: event.currentTarget });

      // When
      component.onBackdropClick(event);

      // Then
      expect(component.onClose).toHaveBeenCalled();
    });

    it('should not close on content click', () => {
      // Given
      spyOn(component, 'onClose');
      const event = new Event('click');
      const mockTarget = document.createElement('div');
      Object.defineProperty(event, 'target', { value: mockTarget });

      // When
      component.onBackdropClick(event);

      // Then
      expect(component.onClose).not.toHaveBeenCalled();
    });
  });

  /**
   * Test body lock management.
   * Test de gestion du verrouillage du body.
   */
  describe('Body Lock Management', () => {
    it('should call ngOnChanges when modal opens', () => {
      // Given
      spyOn(component, 'ngOnChanges');

      // When
      component.isOpen = true;
      component.ngOnChanges();

      // Then
      expect(component.ngOnChanges).toHaveBeenCalled();
    });

    it('should call ngOnChanges when modal closes', () => {
      // Given
      spyOn(component, 'ngOnChanges');

      // When
      component.isOpen = false;
      component.ngOnChanges();

      // Then
      expect(component.ngOnChanges).toHaveBeenCalled();
    });
  });
}); 