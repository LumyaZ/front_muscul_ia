import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { TrainingInfoFormComponent } from './training-info-form.component';
import { TrainingInfoService } from '../../services/training-info.service';
import { Gender, ExperienceLevel, SessionFrequency, SessionDuration, MainGoal, TrainingPreference, Equipment } from '../../models/training-info.model';
import { Router } from '@angular/router';

describe('TrainingInfoFormComponent', () => {
  let component: TrainingInfoFormComponent;
  let fixture: ComponentFixture<TrainingInfoFormComponent>;
  let trainingInfoService: TrainingInfoService;
  let router: Router;

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
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        TrainingInfoFormComponent
      ],
      providers: [TrainingInfoService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingInfoFormComponent);
    component = fixture.componentInstance;
    trainingInfoService = TestBed.inject(TrainingInfoService);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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

  it('should check existing training info on init', () => {
    spyOn(trainingInfoService, 'existsTrainingInfo').and.returnValue(of(false));
    
    component.ngOnInit();
    
    expect(trainingInfoService.existsTrainingInfo).toHaveBeenCalled();
    expect(component.isEditMode).toBeFalse();
  });

  it('should load existing training info when in edit mode', () => {
    spyOn(trainingInfoService, 'existsTrainingInfo').and.returnValue(of(true));
    spyOn(trainingInfoService, 'getTrainingInfo').and.returnValue(of(mockTrainingInfo));
    
    component.ngOnInit();
    
    expect(component.isEditMode).toBeTrue();
    expect(trainingInfoService.getTrainingInfo).toHaveBeenCalled();
    expect(component.existingTrainingInfo).toEqual(mockTrainingInfo);
  });

  it('should create training info successfully', () => {
    spyOn(trainingInfoService, 'existsTrainingInfo').and.returnValue(of(false));
    spyOn(trainingInfoService, 'createTrainingInfo').and.returnValue(of(mockTrainingInfo));
    
    component.ngOnInit();
    
    // Fill form
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
    
    expect(trainingInfoService.createTrainingInfo).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should update training info successfully', () => {
    spyOn(trainingInfoService, 'existsTrainingInfo').and.returnValue(of(true));
    spyOn(trainingInfoService, 'getTrainingInfo').and.returnValue(of(mockTrainingInfo));
    spyOn(trainingInfoService, 'updateTrainingInfo').and.returnValue(of(mockTrainingInfo));
    
    component.ngOnInit();
    
    // Fill form
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
    
    expect(trainingInfoService.updateTrainingInfo).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should handle error when creating training info', () => {
    spyOn(trainingInfoService, 'existsTrainingInfo').and.returnValue(of(false));
    spyOn(trainingInfoService, 'createTrainingInfo').and.returnValue(throwError(() => ({ error: { message: 'Error message' } })));
    
    component.ngOnInit();
    
    // Fill form
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
    
    expect(component.error).toBe('Error message');
    expect(component.isLoading).toBeFalse();
  });

  it('should not submit if form is invalid', () => {
    spyOn(trainingInfoService, 'createTrainingInfo');
    
    component.onSubmit();
    
    expect(trainingInfoService.createTrainingInfo).not.toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  });

  it('should get display name correctly', () => {
    const displayNames = { 'TEST': 'Test Display' };
    const result = component.getDisplayName('TEST', displayNames);
    expect(result).toBe('Test Display');
  });

  it('should return enum value if display name not found', () => {
    const displayNames = { 'TEST': 'Test Display' };
    const result = component.getDisplayName('UNKNOWN', displayNames);
    expect(result).toBe('UNKNOWN');
  });
}); 