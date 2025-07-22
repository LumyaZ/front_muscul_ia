import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../services/auth.service';
import { of } from 'rxjs';

/**
 * Basic unit test for LoginComponent.
 * Test unitaire de base pour LoginComponent.
 */
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
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
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should have a valid form with correct data', () => {
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should call authService.login when form is valid', () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      creationDate: '2024-01-01T00:00:00',
    };
    mockAuthService.login.and.returnValue(of(mockUser));

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
    });

    component.onSubmit();

    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('should not call authService.login when form is invalid', () => {
    component.loginForm.patchValue({
      email: 'invalid-email',
      password: '123',
    });

    component.onSubmit();

    expect(mockAuthService.login).not.toHaveBeenCalled();
  });
});
