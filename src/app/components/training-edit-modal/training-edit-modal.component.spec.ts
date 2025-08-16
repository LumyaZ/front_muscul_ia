import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TrainingEditModalComponent } from './training-edit-modal.component';
import { TrainingInfoService } from '../../services/training-info.service';
import { TrainingInfo, Gender, ExperienceLevel, SessionFrequency, SessionDuration, MainGoal, TrainingPreference, Equipment } from '../../models/training-info.model';
import { of, throwError } from 'rxjs';

describe('TrainingEditModalComponent', () => {
  let component: TrainingEditModalComponent;
  let fixture: ComponentFixture<TrainingEditModalComponent>;
  let mockTrainingInfoService: jasmine.SpyObj<TrainingInfoService>;

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
    const spy = jasmine.createSpyObj('TrainingInfoService', ['updateTrainingInfo']);

    await TestBed.configureTestingModule({
      imports: [
        TrainingEditModalComponent,
        ReactiveFormsModule
      ],
      providers: [
        { provide: TrainingInfoService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingEditModalComponent);
    component = fixture.componentInstance;
    mockTrainingInfoService = TestBed.inject(TrainingInfoService) as jasmine.SpyObj<TrainingInfoService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.isOpen).toBe(false);
      expect(component.category).toBe('personal');
      expect(component.currentTrainingInfo).toBeNull();
      expect(component.isLoading).toBe(false);
      expect(component.error).toBeNull();
    });

    it('should initialize form on ngOnInit', () => {
      component.ngOnInit();
      expect(component.editForm).toBeDefined();
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should validate required fields', () => {
      const genderControl = component.editForm.get('gender');
      const weightControl = component.editForm.get('weight');
      const heightControl = component.editForm.get('height');

      expect(genderControl?.hasError('required')).toBe(true);
      expect(weightControl?.hasError('required')).toBe(true);
      expect(heightControl?.hasError('required')).toBe(true);
    });

    it('should validate weight constraints', () => {
      const weightControl = component.editForm.get('weight');
      weightControl?.setValue(25);
      expect(weightControl?.hasError('min')).toBe(true);
      weightControl?.setValue(350);
      expect(weightControl?.hasError('max')).toBe(true);
    });

    it('should validate height constraints', () => {
      const heightControl = component.editForm.get('height');
      heightControl?.setValue(80);
      expect(heightControl?.hasError('min')).toBe(true);
      heightControl?.setValue(280);
      expect(heightControl?.hasError('max')).toBe(true);
    });

    it('should accept valid form data', () => {
      component.editForm.patchValue({
        gender: Gender.MALE,
        weight: 75,
        height: 180,
        bodyFatPercentage: 15
      });
      expect(component.editForm.valid).toBe(true);
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.currentTrainingInfo = mockTrainingInfo;
    });

    it('should call updateTrainingInfo with form data', () => {
      const formData = {
        gender: Gender.MALE,
        weight: 75,
        height: 180,
        bodyFatPercentage: 15
      };
      component.editForm.patchValue(formData);
      mockTrainingInfoService.updateTrainingInfo.and.returnValue(of(mockTrainingInfo));

      component.onSubmit();

      expect(mockTrainingInfoService.updateTrainingInfo).toHaveBeenCalled();
    });

    it('should handle successful update', (done) => {
      spyOn(component.trainingUpdated, 'emit');
      spyOn(component.closeModal, 'emit');
      component.editForm.patchValue({
        gender: Gender.MALE,
        weight: 75,
        height: 180
      });
      mockTrainingInfoService.updateTrainingInfo.and.returnValue(of(mockTrainingInfo));

      component.onSubmit();

      setTimeout(() => {
        expect(component.isLoading).toBe(false);
        expect(component.error).toBeNull();
        expect(component.trainingUpdated.emit).toHaveBeenCalledWith(mockTrainingInfo);
        expect(component.closeModal.emit).toHaveBeenCalled();
        done();
      });
    });

    it('should handle update error', (done) => {
      component.editForm.patchValue({
        gender: Gender.MALE,
        weight: 75,
        height: 180
      });
      mockTrainingInfoService.updateTrainingInfo.and.returnValue(throwError(() => ({ status: 400 })));

      component.onSubmit();

      setTimeout(() => {
        expect(component.error).toBe('Veuillez vérifier les informations saisies.');
        expect(component.isLoading).toBe(false);
        done();
      });
    });

    it('should not submit if form is invalid', () => {
      component.editForm.patchValue({
        gender: '',
        weight: 25,
        height: 180
      });

      component.onSubmit();

      expect(mockTrainingInfoService.updateTrainingInfo).not.toHaveBeenCalled();
    });

    it('should not submit if currentTrainingInfo is null', () => {
      component.currentTrainingInfo = null;
      component.editForm.patchValue({
        gender: Gender.MALE,
        weight: 75,
        height: 180
      });

      component.onSubmit();

      expect(mockTrainingInfoService.updateTrainingInfo).not.toHaveBeenCalled();
    });
  });

  describe('Modal Management', () => {
    it('should emit closeModal when close is called', () => {
      spyOn(component.closeModal, 'emit');

      component.onClose();

      expect(component.closeModal.emit).toHaveBeenCalled();
    });

    it('should handle backdrop click', () => {
      spyOn(component, 'onClose');
      const mockEvent = {
        target: document.createElement('div'),
        currentTarget: document.createElement('div')
      } as any;
      mockEvent.target = mockEvent.currentTarget;

      component.onBackdropClick(mockEvent);

      expect(component.onClose).toHaveBeenCalled();
    });
  });

  describe('Field Validation', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should return true for invalid field that has been touched', () => {
      const weightControl = component.editForm.get('weight');
      weightControl?.setValue(25);
      weightControl?.markAsTouched();

      expect(component.isFieldInvalid('weight')).toBe(true);
    });

    it('should return false for valid field', () => {
      const weightControl = component.editForm.get('weight');
      weightControl?.setValue(75);

      expect(component.isFieldInvalid('weight')).toBe(false);
    });
  });

  describe('Lifecycle Hooks', () => {
    it('should handle changes when modal opens', () => {
      component.ngOnInit();
      component.isOpen = true;
      component.currentTrainingInfo = mockTrainingInfo;

      component.ngOnChanges();

      expect(component.editForm.get('gender')?.value).toBe(mockTrainingInfo.gender);
      expect(component.editForm.get('weight')?.value).toBe(mockTrainingInfo.weight);
    });

    it('should handle changes when modal closes', () => {
      component.isOpen = false;
      spyOn(component as any, 'unlockBody');

      component.ngOnChanges();

      expect((component as any).unlockBody).toHaveBeenCalled();
    });

    it('should unlock body on destroy', () => {
      spyOn(component as any, 'unlockBody');

      component.ngOnDestroy();

      expect((component as any).unlockBody).toHaveBeenCalled();
    });
  });

  describe('Data Loading', () => {
    it('should load current training data into form', () => {
      component.ngOnInit();
      component.currentTrainingInfo = mockTrainingInfo;

      component.loadCurrentData();

      expect(component.editForm.get('gender')?.value).toBe(mockTrainingInfo.gender);
      expect(component.editForm.get('weight')?.value).toBe(mockTrainingInfo.weight);
    });

    it('should handle missing training info gracefully', () => {
      component.ngOnInit();
      component.currentTrainingInfo = null;
      spyOn(console, 'warn');

      component.loadCurrentData();

      expect(console.warn).toHaveBeenCalledWith('No training info or form not initialized');
    });
  });
});