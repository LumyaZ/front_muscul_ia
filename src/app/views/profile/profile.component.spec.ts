import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProfileComponent } from './profile.component';
import { AuthService } from '../../services/auth.service';
import { UserProfileService } from '../../services/user-profile.service';
import { TrainingInfoService } from '../../services/training-info.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let userProfileService: jasmine.SpyObj<UserProfileService>;
  let trainingInfoService: jasmine.SpyObj<TrainingInfoService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'getCurrentUser']);
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
