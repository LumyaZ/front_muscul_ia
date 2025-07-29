import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { YouComponent } from './you.component';
import { AuthService } from '../../../services/auth.service';

describe('YouComponent', () => {
  let component: YouComponent;
  let fixture: ComponentFixture<YouComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);

    await TestBed.configureTestingModule({
      imports: [YouComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(YouComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default tab as trainings', () => {
    expect(component.selectedTab).toBe('trainings');
  });

  it('should change selected tab when selectTab is called', () => {
    component.selectTab('programs');
    expect(component.selectedTab).toBe('programs');

    component.selectTab('trainings');
    expect(component.selectedTab).toBe('trainings');
  });

  it('should call getCurrentUser on init', () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    mockAuthService.getCurrentUser.and.returnValue(mockUser);

    component.ngOnInit();

    expect(mockAuthService.getCurrentUser).toHaveBeenCalled();
    expect(component.user).toBe(mockUser);
  });
}); 