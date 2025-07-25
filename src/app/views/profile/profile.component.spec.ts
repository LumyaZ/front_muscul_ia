import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { ProfileComponent } from './profile.component';
import { AuthService } from '../../services/auth.service';
import { UserProfileService } from '../../services/user-profile.service';
import { TrainingInfoService } from '../../services/training-info.service';
import { User } from '../../models/user.model';
import { UserProfile } from '../../models/user-profile.model';
import { TrainingInfo, Gender, ExperienceLevel, SessionFrequency, SessionDuration, MainGoal, TrainingPreference, Equipment } from '../../models/training-info.model';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let userProfileService: jasmine.SpyObj<UserProfileService>;
  let trainingInfoService: jasmine.SpyObj<TrainingInfoService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'getCurrentUser', 'logout']);
    const userProfileServiceSpy = jasmine.createSpyObj('UserProfileService', ['getMyProfile']);
    const trainingInfoServiceSpy = jasmine.createSpyObj('TrainingInfoService', ['getTrainingInfo']);

    await TestBed.configureTestingModule({
      imports: [
        ProfileComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserProfileService, useValue: userProfileServiceSpy },
        { provide: TrainingInfoService, useValue: trainingInfoServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    userProfileService = TestBed.inject(UserProfileService) as jasmine.SpyObj<UserProfileService>;
    trainingInfoService = TestBed.inject(TrainingInfoService) as jasmine.SpyObj<TrainingInfoService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test component initialization with authentication.
   * Test d'initialisation du composant avec authentification.
   */
  describe('Initialization', () => {
    it('should load user data on init', () => {
      // Given
      const mockUser: User = {
        id: 1,
        email: 'test@example.com',
        creationDate: '2025-01-01T00:00:00'
      };
      const mockUserProfile: UserProfile = {
        id: 1,
        userId: 1,
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        age: 35,
        phoneNumber: '1234567890'
      };
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

      authService.isAuthenticated.and.returnValue(true);
      authService.getCurrentUser.and.returnValue(mockUser);
      userProfileService.getMyProfile.and.returnValue(of(mockUserProfile));
      trainingInfoService.getTrainingInfo.and.returnValue(of(mockTrainingInfo));

      // When
      component.ngOnInit();
      fixture.detectChanges();

      // Then
      expect(component.user).toEqual(mockUser);
      expect(component.userProfile).toEqual(mockUserProfile);
      expect(component.trainingInfo).toEqual(mockTrainingInfo);
      expect(component.isLoading).toBeFalse();
    });

    it('should redirect to login if not authenticated', () => {
      // Given
      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');
      authService.isAuthenticated.and.returnValue(false);

      // When
      component.ngOnInit();

      // Then
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  /**
   * Test training category editing.
   * Test d'édition des catégories d'entraînement.
   */
  describe('Training Category Editing', () => {
    it('should open modal for personal category', () => {
      // When
      component.editTrainingCategory('personal');

      // Then
      expect(component.selectedCategory).toBe('personal');
      expect(component.isModalOpen).toBeTrue();
    });

    it('should open modal for experience category', () => {
      // When
      component.editTrainingCategory('experience');

      // Then
      expect(component.selectedCategory).toBe('experience');
      expect(component.isModalOpen).toBeTrue();
    });

    it('should open modal for goals category', () => {
      // When
      component.editTrainingCategory('goals');

      // Then
      expect(component.selectedCategory).toBe('goals');
      expect(component.isModalOpen).toBeTrue();
    });

    it('should open modal for equipment category', () => {
      // When
      component.editTrainingCategory('equipment');

      // Then
      expect(component.selectedCategory).toBe('equipment');
      expect(component.isModalOpen).toBeTrue();
    });
  });

  /**
   * Test modal management.
   * Test de gestion des modales.
   */
  describe('Modal Management', () => {
    it('should close modal', () => {
      // Given
      component.isModalOpen = true;

      // When
      component.closeTrainingModal();

      // Then
      expect(component.isModalOpen).toBeFalse();
    });

    it('should handle training update', () => {
      // Given
      const updatedTrainingInfo: TrainingInfo = {
        id: 1,
        userId: 1,
        gender: Gender.MALE,
        weight: 80,
        height: 180,
        experienceLevel: ExperienceLevel.ADVANCED,
        sessionFrequency: SessionFrequency.FIVE_TO_SIX,
        sessionDuration: SessionDuration.LONG,
        mainGoal: MainGoal.STRENGTH,
        trainingPreference: TrainingPreference.MIXED,
        equipment: Equipment.FULL_EQUIPMENT,
        bmi: 24.7
      };
      component.isModalOpen = true;

      // When
      component.onTrainingUpdated(updatedTrainingInfo);

      // Then
      expect(component.trainingInfo).toEqual(updatedTrainingInfo);
      expect(component.isModalOpen).toBeFalse();
    });
  });

  /**
   * Test display name translations.
   * Test des traductions des noms d'affichage.
   */
  describe('Display Name Translations', () => {
    it('should translate gender enum', () => {
      // When
      const result = component.getDisplayName(Gender.MALE, component.genderDisplayNames);

      // Then
      expect(result).toBe('Homme');
    });

    it('should translate experience level enum', () => {
      // When
      const result = component.getDisplayName(ExperienceLevel.INTERMEDIATE, component.experienceLevelDisplayNames);

      // Then
      expect(result).toBe('Intermédiaire');
    });

    it('should return original value if no translation found', () => {
      // When
      const result = component.getDisplayName('UNKNOWN_VALUE', component.genderDisplayNames);

      // Then
      expect(result).toBe('UNKNOWN_VALUE');
    });

    it('should return empty string for undefined value', () => {
      // When
      const result = component.getDisplayName(undefined, component.genderDisplayNames);

      // Then
      expect(result).toBe('');
    });
  });

  /**
   * Test navigation methods.
   * Test des méthodes de navigation.
   */
  describe('Navigation', () => {
    it('should navigate to dashboard', () => {
      // Given
      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');

      // When
      component.goBackToDashboard();

      // Then
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should navigate to training info', () => {
      // Given
      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');

      // When
      component.editTrainingInfo();

      // Then
      expect(router.navigate).toHaveBeenCalledWith(['/training-info']);
    });

    it('should logout and navigate to login', () => {
      // Given
      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');

      // When
      component.logout();

      // Then
      expect(authService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
