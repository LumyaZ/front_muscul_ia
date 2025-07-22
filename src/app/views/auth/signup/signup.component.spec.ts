import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup.component';
import { AuthService } from '../../../services/auth.service';
import { of } from 'rxjs';
import { CreateUserWithProfileResponse } from '../../../models/user-profile.model';

/**
 * Basic unit test for SignupComponent.
 * Test unitaire de base pour SignupComponent.
 */
describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['createUserWithProfile']);

    await TestBed.configureTestingModule({
      imports: [
        SignupComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(
      AuthService,
    ) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form initially', () => {
    expect(component.signupForm.valid).toBeFalsy();
  });

  it('should have a valid form with correct data', () => {
    component.signupForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      phoneNumber: '0123456789'
    });
    expect(component.signupForm.valid).toBeTruthy();
  });

  it('should have invalid form when passwords do not match', () => {
    component.signupForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'differentpassword',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01'
    });
    expect(component.signupForm.valid).toBeFalsy();
    expect(component.signupForm.errors?.['passwordMismatch']).toBeTruthy();
  });

  it('should call authService.createUserWithProfile when form is valid', () => {
    const mockResponse: CreateUserWithProfileResponse = {
      user: {
        id: 1,
        email: 'test@example.com',
        creationDate: '2024-01-01T00:00:00'
      },
      profile: {
        id: 1,
        userId: 1,
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        age: 34,
        phoneNumber: '0123456789',
        createdAt: '2024-01-01T00:00:00',
        updatedAt: '2024-01-01T00:00:00'
      }
    };
    mockAuthService.createUserWithProfile.and.returnValue(of(mockResponse));

    component.signupForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      phoneNumber: '0123456789'
    });

    component.onSubmit();

    expect(mockAuthService.createUserWithProfile).toHaveBeenCalledWith({
      userData: {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      },
      profileData: {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        phoneNumber: '0123456789'
      }
    });
  });

  it('should not call authService.createUserWithProfile when form is invalid', () => {
    component.signupForm.patchValue({
      email: 'invalid-email',
      password: '123',
      confirmPassword: 'different',
      firstName: '',
      lastName: '',
      dateOfBirth: ''
    });

    component.onSubmit();

    expect(mockAuthService.createUserWithProfile).not.toHaveBeenCalled();
  });

  it('should handle form with optional phone number', () => {
    const mockResponse: CreateUserWithProfileResponse = {
      user: {
        id: 1,
        email: 'test@example.com',
        creationDate: '2024-01-01T00:00:00'
      },
      profile: {
        id: 1,
        userId: 1,
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        age: 34,
        phoneNumber: undefined,
        createdAt: '2024-01-01T00:00:00',
        updatedAt: '2024-01-01T00:00:00'
      }
    };
    mockAuthService.createUserWithProfile.and.returnValue(of(mockResponse));

    component.signupForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      phoneNumber: '' // Phone number vide
    });

    component.onSubmit();

    expect(mockAuthService.createUserWithProfile).toHaveBeenCalledWith({
      userData: {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      },
      profileData: {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        phoneNumber: undefined // Devrait être undefined quand vide
      }
    });
  });
});
