import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UserProgramsComponent } from './user-programs.component';
import { UserTrainingProgramService } from '../../../../services/user-training-program.service';
import { AuthService } from '../../../../services/auth.service';
import { of } from 'rxjs';

describe('UserProgramsComponent', () => {
  let component: UserProgramsComponent;
  let fixture: ComponentFixture<UserProgramsComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockUserTrainingProgramService: jasmine.SpyObj<UserTrainingProgramService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const userTrainingProgramServiceSpy = jasmine.createSpyObj('UserTrainingProgramService', ['getUserPrograms']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);

    await TestBed.configureTestingModule({
      imports: [UserProgramsComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: UserTrainingProgramService, useValue: userTrainingProgramServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserProgramsComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockUserTrainingProgramService = TestBed.inject(UserTrainingProgramService) as jasmine.SpyObj<UserTrainingProgramService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default state', () => {
    expect(component.isLoading).toBe(false);
    expect(component.error).toBeNull();
    expect(component.userPrograms).toEqual([]);
  });

  it('should call loadUserPrograms on init', () => {
    spyOn(component, 'loadUserPrograms');
    
    component.ngOnInit();
    
    expect(component.loadUserPrograms).toHaveBeenCalled();
  });

  it('should navigate to profile when goBackToProfile is called', () => {
    component.goBackToProfile();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/profile']);
  });

  it('should navigate to programs when goToAllPrograms is called', () => {
    component.goToAllPrograms();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/programs']);
  });

  it('should call loadUserPrograms when refreshPrograms is called', () => {
    spyOn(component, 'loadUserPrograms');
    
    component.refreshPrograms();
    
    expect(component.loadUserPrograms).toHaveBeenCalled();
  });

  it('should navigate to create program when createNewProgram is called', () => {
    component.createNewProgram();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/programs/create']);
  });

  it('should navigate to program details when viewProgramDetails is called', () => {
    const programId = 123;
    component.viewProgramDetails(programId);
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/programs', programId]);
  });

  it('should return correct status color', () => {
    expect(component.getStatusColor('IN_PROGRESS')).toBe('#4CAF50');
    expect(component.getStatusColor('COMPLETED')).toBe('#2196F3');
    expect(component.getStatusColor('PAUSED')).toBe('#FF9800');
    expect(component.getStatusColor('NOT_STARTED')).toBe('#9E9E9E');
  });

  it('should return correct status text', () => {
    expect(component.getStatusText('NOT_STARTED')).toBe('Non commencé');
    expect(component.getStatusText('IN_PROGRESS')).toBe('En cours');
    expect(component.getStatusText('COMPLETED')).toBe('Terminé');
    expect(component.getStatusText('PAUSED')).toBe('En pause');
    expect(component.getStatusText('UNKNOWN')).toBe('Inconnu');
  });
}); 