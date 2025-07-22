import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup.component';
import { AuthService } from '../../../services/auth.service';
import { of } from 'rxjs';

/**
 * Basic unit test for SignupComponent.
 * Test unitaire de base pour SignupComponent.
 */
describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['signup']);

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
    });
    expect(component.signupForm.valid).toBeTruthy();
  });

  it('should have invalid form when passwords do not match', () => {
    component.signupForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'differentpassword',
    });
    expect(component.signupForm.valid).toBeFalsy();
    expect(component.signupForm.errors?.['passwordMismatch']).toBeTruthy();
  });

  it('should call authService.signup when form is valid', () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      creationDate: '2024-01-01T00:00:00',
    };
    mockAuthService.signup.and.returnValue(of(mockUser));

    component.signupForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });

    component.onSubmit();

    expect(mockAuthService.signup).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });
  });

  it('should not call authService.signup when form is invalid', () => {
    component.signupForm.patchValue({
      email: 'invalid-email',
      password: '123',
      confirmPassword: 'different',
    });

    component.onSubmit();

    expect(mockAuthService.signup).not.toHaveBeenCalled();
  });
});
