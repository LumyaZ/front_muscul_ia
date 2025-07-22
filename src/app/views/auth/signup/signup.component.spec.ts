import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SignupComponent } from './signup.component';
import { AuthService } from '../../../services/auth.service';

/**
 * Basic unit test for SignupComponent.
 * Test unitaire de base pour SignupComponent.
 */
describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['signup']);

    await TestBed.configureTestingModule({
      imports: [
        SignupComponent,
        ReactiveFormsModule, 
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.signupForm.valid).toBeFalsy();
  });

  it('should have valid form with correct data', () => {
    component.signupForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });
    expect(component.signupForm.valid).toBeTruthy();
  });

  it('should have invalid form when passwords do not match', () => {
    component.signupForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'differentpassword'
    });
    expect(component.signupForm.valid).toBeFalsy();
    expect(component.signupForm.errors?.['passwordsMismatch']).toBeTruthy();
  });
}); 