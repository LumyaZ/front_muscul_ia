import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { AuthService } from '../../../services/auth.service';
import { UserProfileService } from '../../../services/user-profile.service';
import { TrainingInfoService } from '../../../services/training-info.service';
import { User } from '../../../models/user.model';
import { UserProfile } from '../../../models/user-profile.model';
import { TrainingInfo, Gender, ExperienceLevel, SessionFrequency, SessionDuration, MainGoal, TrainingPreference, Equipment } from '../../../models/training-info.model';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let userProfileService: jasmine.SpyObj<UserProfileService>;
  let trainingInfoService: jasmine.SpyObj<TrainingInfoService>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    creationDate: '2023-01-01T00:00:00Z'
  };

  const mockProfile: UserProfile = {
    id: 1,
    userId: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    dateOfBirth: '1990-01-01',
    age: 33,
    phoneNumber: '0612345678',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  };

  const mockTrainingInfo: TrainingInfo = {
    id: 1,
    userId: 1,
    gender: Gender.MALE,
    weight: 75,
    height: 180,
    bmi: 23.1,
    bodyFatPercentage: 15,
    experienceLevel: ExperienceLevel.BEGINNER,
    sessionFrequency: SessionFrequency.THREE_TO_FOUR,
    sessionDuration: SessionDuration.MEDIUM,
    mainGoal: MainGoal.MUSCLE_GAIN,
    trainingPreference: TrainingPreference.STRENGTH_TRAINING,
    equipment: Equipment.GYM_ACCESS,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  };

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'getCurrentUser', 'logout']);
    const profileSpy = jasmine.createSpyObj('UserProfileService', ['getMyProfile']);
    const trainingSpy = jasmine.createSpyObj('TrainingInfoService', ['getTrainingInfo']);
    
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: UserProfileService, useValue: profileSpy },
        { provide: TrainingInfoService, useValue: trainingSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    userProfileService = TestBed.inject(UserProfileService) as jasmine.SpyObj<UserProfileService>;
    trainingInfoService = TestBed.inject(TrainingInfoService) as jasmine.SpyObj<TrainingInfoService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display page title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Vous');
  });

  it('should display user email when authenticated', () => {
    authService.isAuthenticated.and.returnValue(true);
    authService.getCurrentUser.and.returnValue(mockUser);
    userProfileService.getMyProfile.and.returnValue(jasmine.createSpyObj('Observable', ['subscribe']));
    trainingInfoService.getTrainingInfo.and.returnValue(jasmine.createSpyObj('Observable', ['subscribe']));
    
    component.ngOnInit();
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('test@example.com');
  });

  it('should display profile sections', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Informations d\'authentification');
    expect(compiled.textContent).toContain('Informations personnelles');
    expect(compiled.textContent).toContain('Informations d\'entraînement');
    expect(compiled.textContent).toContain('Paramètres');
  });

  it('should display logout button', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Se déconnecter');
  });
}); 