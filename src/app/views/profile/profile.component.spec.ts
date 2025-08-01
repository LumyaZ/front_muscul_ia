import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ProfileComponent } from './profile.component';
import { AuthService } from '../../services/auth.service';
import { UserProfileService } from '../../services/user-profile.service';
import { TrainingInfoService } from '../../services/training-info.service';
import { UserProfile } from '../../models/user-profile.model';
import { 
  TrainingInfo, 
  Gender, 
  ExperienceLevel, 
  SessionFrequency, 
  SessionDuration, 
  MainGoal, 
  TrainingPreference, 
  Equipment
} from '../../models/training-info.model';
import { TrainingEditModalComponent } from '../../components/training-edit-modal/training-edit-modal.component';
import { ProfileEditModalComponent } from '../../components/profile-edit-modal/profile-edit-modal.component';

/**
 * Unit tests for ProfileComponent.
 * Tests unitaires pour ProfileComponent.
 */
describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockUserProfileService: jasmine.SpyObj<UserProfileService>;
  let mockTrainingInfoService: jasmine.SpyObj<TrainingInfoService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockUserProfile: UserProfile = {
    id: 1,
    userId: 1,
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    phoneNumber: '+33123456789',
    createdAt: '2023-01-01T00:00:00',
    updatedAt: '2023-01-01T00:00:00'
  };

  const mockTrainingInfo: TrainingInfo = {
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
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'getCurrentUser']);
    const userProfileServiceSpy = jasmine.createSpyObj('UserProfileService', ['getMyProfile']);
    const trainingInfoServiceSpy = jasmine.createSpyObj('TrainingInfoService', ['getTrainingInfo']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    authServiceSpy.isAuthenticated.and.returnValue(true);
    authServiceSpy.getCurrentUser.and.returnValue({ id: 1, username: 'testuser' });
    userProfileServiceSpy.getMyProfile.and.returnValue(of(mockUserProfile));
    trainingInfoServiceSpy.getTrainingInfo.and.returnValue(of(mockTrainingInfo));

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'dashboard', component: {} as any },
          { path: 'login', component: {} as any }
        ]),
        ProfileComponent,
        TrainingEditModalComponent,
        ProfileEditModalComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserProfileService, useValue: userProfileServiceSpy },
        { provide: TrainingInfoService, useValue: trainingInfoServiceSpy },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockUserProfileService = TestBed.inject(UserProfileService) as jasmine.SpyObj<UserProfileService>;
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
   * Test de chargement des données utilisateur
   * Test loading user data
   */
  it('should load user data on init', () => {
    expect(mockUserProfileService.getMyProfile).toHaveBeenCalled();
    expect(mockTrainingInfoService.getTrainingInfo).toHaveBeenCalled();
  });

  /**
   * Test de navigation vers le dashboard
   * Test navigation to dashboard
   */
  it('should navigate to dashboard when goBack is called', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  /**
   * Test d'ouverture et fermeture des modales
   * Test opening and closing modals
   */
  it('should handle modal operations correctly', () => {
    // Test opening modals
    component.editTrainingInfo();
    expect(component.isModalOpen).toBeTrue();
    
    component.editProfile();
    expect(component.isProfileModalOpen).toBeTrue();
    
    // Test closing modals
    component.closeTrainingModal();
    expect(component.isModalOpen).toBeFalse();
    
    component.closeProfileModal();
    expect(component.isProfileModalOpen).toBeFalse();
  });

  /**
   * Test de mise à jour des données
   * Test updating data
   */
  it('should update data when modals close', () => {
    const updatedTrainingInfo = { ...mockTrainingInfo, weight: 80.0 };
    const updatedProfile = { ...mockUserProfile, firstName: 'Jane' };
    
    component.onTrainingUpdated(updatedTrainingInfo);
    expect(component.trainingInfo).toEqual(updatedTrainingInfo);
    expect(component.isModalOpen).toBeFalse();
    expect(component.error).toBeNull();
    
    component.onProfileUpdated(updatedProfile);
    expect(component.userProfile).toEqual(updatedProfile);
    expect(component.isProfileModalOpen).toBeFalse();
    expect(component.error).toBeNull();
  });

  /**
   * Test de récupération des noms d'affichage
   * Test getting display names
   */
  it('should get display names correctly', () => {
    const displayNames = { 'TEST': 'Test Display' };
    
    expect(component.getDisplayName('TEST', displayNames)).toBe('Test Display');
    expect(component.getDisplayName('UNKNOWN', displayNames)).toBe('UNKNOWN');
    expect(component.getDisplayName(undefined, displayNames)).toBe('Non défini');
  });

  /**
   * Test de vérification de profil complet
   * Test checking complete profile
   */
  it('should check profile completion correctly', () => {
    // Test complete profile
    component.userProfile = mockUserProfile;
    component.trainingInfo = mockTrainingInfo;
    expect(component.hasCompleteProfile()).toBeTrue();
    expect(component.getProfileCompletionPercentage()).toBe(100);
    
    // Test incomplete profile
    component.userProfile = null;
    component.trainingInfo = null;
    expect(component.hasCompleteProfile()).toBeFalse();
    expect(component.getProfileCompletionPercentage()).toBe(0);
  });

  /**
   * Test de gestion d'erreur principale
   * Test main error handling
   */
  it('should handle errors correctly', () => {
    spyOn(component['router'], 'navigate');
    
    // Test 401 error
    component['handleError']({ status: 401 });
    expect(component.error).toBe('Session expirée. Veuillez vous reconnecter.');
    expect(component['router'].navigate).toHaveBeenCalledWith(['/login']);
    
    // Test generic error
    component['handleError']({ status: 500, error: { message: 'Server error' } });
    expect(component.error).toBe('Server error');
  });

  /**
   * Test de vérification de completion du chargement
   * Test checking loading completion
   */
  it('should check loading completion correctly', () => {
    component.isLoading = true;
    component.userProfile = null;
    component.trainingInfo = null;
    
    component['checkLoadingComplete']();
    
    expect(component.isLoading).toBeFalse();
  });
});
