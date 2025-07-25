import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    creationDate: '2023-01-01T00:00:00Z'
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: AuthService, useValue: spy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load current user on init', () => {
    authService.getCurrentUser.and.returnValue(mockUser);
    
    component.ngOnInit();
    
    expect(authService.getCurrentUser).toHaveBeenCalled();
    expect(component.currentUser).toEqual(mockUser);
  });

  it('should display user email when user is loaded', () => {
    authService.getCurrentUser.and.returnValue(mockUser);
    component.ngOnInit();
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('test@example.com');
  });

  it('should not display welcome section when no user', () => {
    authService.getCurrentUser.and.returnValue(null);
    component.ngOnInit();
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).not.toContain('Bienvenue');
  });
}); 